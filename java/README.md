# Hangman Game Java Language Port

https://github.com/OMerkel/hangman/

The full repository holds a set of more language ports for the console game of Hangman. Hangman is a word guessing game.

https://github.com/OMerkel/hangman/tree/master/java

Here you can find the Java ports of Hangman.

## Using the Pure Vanilla Java Port

### Prerequisites

* Java JDK installed, e.g. https://openjdk.java.net/
* environment variable JAVA_HOME pointing to installation folder correctly

### Steps

```
cd pure_java
build.cmd
run.cmd
```

## Using the Maven Build System

### Prerequisites

* Maven installed
* Java JDK installed, e.g. https://openjdk.java.net/
* environment variable JAVA_HOME pointing to installation folder correctly

### Steps

```
cd maven
mvn package
cd target
java -jar hangman-1.0.0.jar
```

## Using the Gradle Build System

### Prerequisites

* Gradle installed
* Java JDK installed, e.g. https://openjdk.java.net/
* environment variable JAVA_HOME pointing to installation folder correctly

### Steps

```
cd gradle
.\gradlew --no-watch-fs jar
cd hangman\build\libs
java -jar hangman.jar
```

## Using the SCons Build System

### Prerequisites

* SCons installed
* Java JDK installed, e.g. https://openjdk.java.net/
* environment variable JAVA_HOME pointing to installation folder correctly

### Steps

```
cd scons
scons
java -jar hangman.jar
```
