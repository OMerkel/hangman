if "%JAVA_HOME%" == "" (
  rem Your JAVA_HOME here
  set JAVA_HOME==D:\private\portable\OpenJDK64
) ELSE (
  echo %JAVA_HOME%
)
del hangman\*.class
%JAVA_HOME%\bin\java -version
%JAVA_HOME%\bin\javac hangman\Hangman.java
