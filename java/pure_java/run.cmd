if "%JAVA_HOME%" == "" (
  rem Your JAVA_HOME here
  set JAVA_HOME==D:\private\portable\OpenJDK64
) ELSE (
  echo %JAVA_HOME%
)
%JAVA_HOME%\bin\java hangman.Hangman
