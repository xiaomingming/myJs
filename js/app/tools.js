require(['knife'], function(knife) {
    var arr = [1, 3, 7, 9, 10, 20, 22],
        arr2 = [2, 5],
        str = ' llalalala ';
    console.log(knife.randomArr(arr));
    console.log(knife.pushArr(arr2, arr));
    console.log(knife.shuffleArr(arr));
    console.log(str, knife.trim(str), knife.trimLeft(str), knife.trimRight(str));
});

