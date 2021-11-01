$('#period').change(function() {
    var period = $(this).val();
    var year_select = $('#year').empty();
    switch (period) {
        case "史前時期":
            year_select.append(
                $('<option></option>').val("-2999~-2500").html("-2999~-2500"),
                $('<option></option>').val("-2499~-2000").html("-2499~-2000"),
                $('<option></option>').val("-1999~-1500").html("-1999~-1500"),
                $('<option></option>').val("-1499~-1000").html("-1499~-1000"),
                $('<option></option>').val("--999~-500").html("-999~-500"),
                $('<option></option>').val("-499~0").html("-499~0"),
            );
            break;
        case "荷西時期":
            for (var i = 1624; i <= 1661; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "明鄭時期":
            for (var i = 1662; i <= 1683; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "清朝時期":
            for (var i = 1683; i <= 1894; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "日本時期":
            for (var i = 1895; i <= 1945; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "現代台灣":
            current_year = new Date().getFullYear();
            for (var i = 1946; i <= current_year; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "西元前~0":
            year_select.append(
                $('<option></option>').val("-2999~-2500").html("-2999~-2500"),
                $('<option></option>').val("-2499~-2000").html("-2499~-2000"),
                $('<option></option>').val("-1999~-1500").html("-1999~-1500"),
                $('<option></option>').val("-1499~-1000").html("-1499~-1000"),
                $('<option></option>').val("--999~-500").html("-999~-500"),
                $('<option></option>').val("-499~0").html("-499~0"),
            );
            break;
        case "0~99":
            for (var i = 0; i <= 99; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "100~199":
            for (var i = 100; i <= 199; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "200~299":
            for (var i = 200; i <= 299; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "300~399":
            for (var i = 300; i <= 399; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "400~499":
            for (var i = 400; i <= 499; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "500~599":
            for (var i = 500; i <= 599; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "600~699":
            for (var i = 600; i <= 699; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "700~799":
            for (var i = 700; i <= 799; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "800~899":
            for (var i = 800; i <= 899; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "900~999":
            for (var i = 900; i <= 999; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "1000~1099":
            for (var i = 1000; i <= 1099; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "1100~1199":
            for (var i = 1100; i <= 1199; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "1200~1299":
            for (var i = 1200; i <= 1299; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "1300~1399":
            for (var i = 1300; i <= 1399; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "1400~1499":
            for (var i = 1400; i <= 1499; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "1500~1599":
            for (var i = 1500; i <= 1599; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "1600~1699":
            for (var i = 1600; i <= 1699; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "1700~1799":
            for (var i = 1700; i <= 1799; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "1800~1899":
            for (var i = 1800; i <= 1899; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "1900~1999":
            for (var i = 1900; i <= 1999; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
        case "2000~":
            current_year = new Date().getFullYear();
            for (var i = 2000; i <= current_year; i++) {
                year_select.append(
                    $('<option></option>').val(i).html(i)
                );
            }
            break;
    }
});
