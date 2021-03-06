(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var APP = {};

var resultName = {};
var resultHouse = {};

//Инициализация приложения
APP.init = function () {
    this.load();
    this.listener();
};

/*-----------------------------------------------*/
/* Загрузка слайдеров и прочей лабуды при  загрузке окна
/*-----------------------------------------------*/

APP.load = function () {

    //Получение массива имен
    APP.getJsonDataName('');

    //Получение массива домов
    APP.getJsonDataHouse('');
};

/*-----------------------------------------------*/
/* Парсеры и генераторы html-кода
/*-----------------------------------------------*/

//Получение массива имен по текущим данным из строки ФИО
APP.getJsonDataName = function (input) {

    var searchContext = input;
    var expr = new RegExp(searchContext, "i");

    $.post('/json.php', { NAME: "Y" }, function (data) {
        resultName = $.parseJSON(data);
        var str = '<ul>';
        $.each(resultName, function (i, elem) {
            if (elem.name.search(expr) != -1) {
                str += '<li  data-content="' + resultName[i].name.toLowerCase() + '" id="' + resultName[i].name.toLowerCase() + '">' + resultName[i].name;
            };
        });
        $('#user_names').html(str);
    });
};

//Получение массива имен по текущим данным из строки Выбрать строение
APP.getJsonDataHouse = function (input) {
    var searchContext = input;
    var expr = new RegExp(searchContext, "i");

    $.post('/json.php', { HOUSE: "Y" }, function (data) {
        //Полученный JSON массив преобразуем в объект
        resultHouse = $.parseJSON(data);     
        //Массив для хранения названий домов
        var houseNames = [];
        //При каждом элементе в объекте resultHouse сделать
        $.each(resultHouse, function (i) {
            houseNames.push(resultHouse[i].name);
        });
        //Переменная для хранения сгенерированной html-строки 
        var str = '<ul>';
        //При каждом элементе в объекте resultHouse сделать:
        $.each(houseNames, function (i) {
            if (houseNames[i].search(expr) != -1) {
                //Положить в строчку название дома из массива
                str += '<li data-content="' + houseNames[i].toLowerCase() + '" id="' + houseNames[i].toLowerCase() + '">' + houseNames[i];
            };
        });
        //Выводим список всех домов, содержащих хотя бы один вопрос
        $('#building').html(str);
    });
};

//Генерация и подгрузка доп.вопросов к дому
APP.generateQuestionsBlock = function (val) {
    $.each(resultHouse, function (i) {
        if (resultHouse[i].name == val) {
            var givenHouse = resultHouse[i];
            var str_q = '<h2>Выбрать пожелания</h2>';

            $('.input-other > input').val('');
            $('button.button').attr("disabled", "disabled");

            for (var i in givenHouse.questions) {
                //Если дом содержит доп.вопросы
                if (givenHouse.questions[i]) {
                    str_q += '<p><span>' + givenHouse.questions[i] + '</span></p><p><input type="radio" name="extra' + i + '" value="yes" id="extra' + i + '_yes"><label for="extra' + i + '_yes"><span></span>Да</label> <input type="radio" name="extra' + i + '" value="no" id="extra' + i + '_no"><label for="extra' + i + '_no"><span></span>Нет</label></p>';
                    $('#questions_block').html(str_q).css("display", "block");
                    $('.input-other').css("display", "block");
                    $('.input-other > input').removeAttr("required");
                } else if (givenHouse.questions[1] == '') {
                    str_q = '';
                    $('#questions_block').html(str_q).css("display", "none");
                    $('.input-other').css("display", "block");
                    $('.input-other > input').attr("required", "required");
                };
            };
        };

        //Отслеживание кол-ва чекнутых радио-баттонов,
        //если ровно половина, то активируется кнопка
        var radioCount = 0;
        var checkedCount = 0;
        $(':radio').bind('click', function () {
            radioCount = $(':radio');
            checkedCount = $(':checked');
            if (radioCount.length / checkedCount.length == 2) {
                $('button.button').removeAttr("disabled");
            };
        });
    });
};

/*-----------------------------------------------*/
/* Прослушка
/*-----------------------------------------------*/
APP.listener = function () {

    //Запрет отправки формы на Enter
    $('form').on('keyup', function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });

    // Прослушка ввода поля ФИО
    $('#user_name_input').bind('input', function () {
        $('#user_names').css('display', 'block');
        var val = $('#user_name_input').val();
        var opts = $('#user_names > ul > li');
        APP.getJsonDataName(val);
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].innerHTML == val) {
                $('#user_name_input').val(val);
                $('#user_names').css('display', 'none');
            };
        };
    });

    //Подстановка ФИО в поле ввода с помощью клавиатурных стрелок
    var countForArrowsForName = -1;
    $('#user_name_input').on('keydown', function (event) {
        var key = event.keyCode;
        var opts = $('#user_names > ul > li');
        switch (key) {
            case 38:
                //up
                countForArrowsForName--;
                if (countForArrowsForName == -2) {
                    countForArrowsForName = -1;
                }
                var givenOpt = opts[countForArrowsForName];
                $(opts).css('background', '#fff');
                $(givenOpt).css('background', '#eee');
                break;
            case 40:
                //down
                countForArrowsForName++;
                var givenOpt = opts[countForArrowsForName];
                $(opts).css('background', '#fff');
                $(givenOpt).css('background', '#eee');
                break;
            case 13:
                //enter
                if (countForArrowsForName == -1) {
                    countForArrowsForName = 0;
                    var givenOpt = opts[countForArrowsForName];
                    var val = $('#user_name_input').val(givenOpt.innerHTML);
                    $('#user_names').css('display', 'none');
                    APP.generateQuestionsBlock(val.val());
                    countForArrowsForName = -1;
                } else {
                    var givenOpt = opts[countForArrowsForName];
                    var val = $('#user_name_input').val(givenOpt.innerHTML);
                    $('#user_names').css('display', 'none');
                    APP.generateQuestionsBlock(val.val());
                    countForArrowsForName = -1;
                };

                break;
        };
    });

    //Подстановка имени в поле ввода кликом мыши
    $('#user_names').on('click', function (event) {
        var target = event.target;
        if ($(target).is('li')) {
            var val = $('#user_name_input').val(target.innerHTML);
            $('#user_names').css('display', 'none');
            countForArrowsForName = -1;
        };
    });

    // Просушка ввода поля Выбрать строение
    $('#house_input').bind('input', function () {
        $('#building').css('display', 'block');
        var val = $('#house_input').val();
        var opts = $('#building > ul > li');
        APP.getJsonDataHouse(val);

        //Генерация блока вопросов, если название целиком введено с клавиатуры
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].innerHTML == val) {
                var val = $('#house_input').val(val);
                $('#building').css('display', 'none');
                APP.generateQuestionsBlock(val.val());
            };
        };
    });

    //Подстановка строения в поле ввода с помощью клавиатурных стрелок
    var countForArrowsForHouses = -1;
    $('#house_input').on('keydown', function (event) {
        var key = event.keyCode;
        var opts = $('#building > ul > li');
        switch (key) {
            case 38:
                //up
                countForArrowsForHouses--;
                if (countForArrowsForHouses == -2) {
                    countForArrowsForHouses = -1;
                }
                var givenOpt = opts[countForArrowsForHouses];
                $(opts).css('background', '#fff');
                $(givenOpt).css('background', '#eee');
                break;
            case 40:
                //down
                countForArrowsForHouses++;
                var givenOpt = opts[countForArrowsForHouses];
                $(opts).css('background', '#fff');
                $(givenOpt).css('background', '#eee');
                break;
            case 13:
                //enter
                if (countForArrowsForHouses == -1) {
                    countForArrowsForHouses = 0;
                    var givenOpt = opts[countForArrowsForHouses];
                    var val = $('#house_input').val(givenOpt.innerHTML);
                    $('#building').css('display', 'none');
                    APP.generateQuestionsBlock(val.val());
                    countForArrowsForHouses = 0;
                } else {
                    var givenOpt = opts[countForArrowsForHouses];
                    var val = $('#house_input').val(givenOpt.innerHTML);
                    $('#building').css('display', 'none');
                    APP.generateQuestionsBlock(val.val());
                    countForArrowsForHouses = -1;
                };
                break;
        };
    });

    //Подстановка строения в поле ввода кликом мыши
    $('#building').on('click', function (event) {
        var target = event.target;
        if ($(target).is('li')) {
            var val = $('#house_input').val(target.innerHTML);
            $('#building').css('display', 'none');
            APP.generateQuestionsBlock(val.val());
        };
    });

    //Прослушка поля Другое
    $('.input-other > input').bind('input', function () {
        var inputOther = $('.input-other > input');
        if ((inputOther.val() == '') && (inputOther.is('[required]'))) {
            $('button.button').attr("disabled", "disabled");
        } else if (inputOther.val() != '' && (inputOther.is('[required]'))) {
            $('button.button').removeAttr("disabled");
        }
    });
};

$(document).ready(function () {
    APP.init();
    $('#user_name_input').focus();
});

},{}]},{},[1])


//# sourceMappingURL=app.min.js.map
