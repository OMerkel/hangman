if not exist bin mkdir bin
pushd bin
cmake ../src
cmake --build . --config release
pushd release
if not exist dict_en.txt copy ..\..\src\dict_en.txt .
hangman
popd
popd
