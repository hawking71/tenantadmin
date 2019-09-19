import java.sql.*;
import com.sybase.jdbc4.jdbc.*;
import java.io.*;
import java.nio.file.*;

class DatabaseQuery {

  private static void writeQueryResultToCommandline(ResultSet rs) {
    try {
      ResultSetMetaData rsmd = rs.getMetaData();
      int columnsNumber = rsmd.getColumnCount();
      while (rs.next()) {
        for (int i = 1; i <= columnsNumber; i++) {
          if (i > 1)
            System.out.print(",  ");
          String columnValue = rs.getString(i);
          System.out.print(columnValue + " " + rsmd.getColumnName(i));
        }
        System.out.println("");
      }
      rs.beforeFirst();
    } catch (Exception ex) {
      System.out.println(ex);
    }
  }

  public static ResultSet query(String jdbcUrl, String dbUser, String dbPassword, String query) {
    ResultSet rs = null;
    try {
      Connection conn = DriverManager.getConnection(jdbcUrl, dbUser, dbPassword);
      Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
      rs = stmt.executeQuery(query);
      writeQueryResultToCommandline(rs);
      conn.close();
    } catch (Exception ex) {
      System.out.println(ex);
    }
    return rs;
  }
}

class query_database {
  public static void main(String[] args) {
    try {
      ResultSet rs = DatabaseQuery.query(args[0], args[1], args[2], args[3]);
    } catch (Exception ex) {
      System.out.println(ex);
    }
  }
}
