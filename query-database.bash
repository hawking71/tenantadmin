#!/bin/bash 

# db link url 
JDBC_URL=''
# DB user/password
DB_USER=''
DB_PASS=''
QUERY=''
# output filename
OUT_FILENAME=''

echo "args= " "$@"

while getopts ":d:u:p:q:o:" arg #选项后面的冒号表示该选项需要参数
do
        case $arg in
             d)
                JDBC_URL=$OPTARG
                ;;
             u)
                DB_USER=$OPTARG
                ;;
             p)
                DB_PASS=$OPTARG
                ;;
             q)
                QUERY=$OPTARG
                ;;
             o)
                OUT_FILENAME=$OPTARG
                ;;
             ?)  #当有不认识的选项的时候arg为?
                echo "含有未知参数" + $arg + $OPTARG
                ;;
        esac
done

# execute java code that executes query
function execute_query(){
  echo $JDBC_URL
  echo $DB_USER + ':' + $DB_PASS
  echo $QUERY
  export CLASSPATH="./jconn4.jar:./"
  java query_database "$JDBC_URL" "$DB_USER" "$DB_PASS" "$QUERY"

}

execute_query | tee $OUT_FILENAME
  


