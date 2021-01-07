//SQL LITE MAIN
var Database;
var dateToday = new Date().toDateString();

function WebSQLInit() {
    var DBObj = this;
    Database = window.openDatabase('Database', '1.0', 'webDatabase', 2 * 1024 * 1024);

    //SQL LITE FUNCTIONS Start
    function DropTable(tablename) {
        var sql = "DROP TABLE [" + tablename + "]";
        Database.transaction(function (ws) {
            ws.executeSql(sql, []);
        }
            , function (err) {
                window.alert("Error 3: " + err.message);
            }
        );
    }

    function DropView(tablename) {
        var sql = "DROP VIEW [" + tablename + "]";
        Database.transaction(function (ws) {
            ws.executeSql(sql, []);
        }
            , function (err) {
                window.alert("Error 4: " + err.message);
            }
        );
    }

    function DropIndex(tablename) {
        var sql = "DROP INDEX [" + tablename + "]";
        Database.transaction(function (ws) {
            ws.executeSql(sql, []);
        }
            , function (err) {
                window.alert("Error 5: " + err.message);
            }

        );
    }

    function checkDBChanges(x) {
        if (
            x.toUpperCase().indexOf("INSERT INTO ") > -1 ||
            x.toUpperCase().indexOf("UPDATE ") > -1 ||
            x.toUpperCase().indexOf("DELETE ") > -1 ||
            x.toUpperCase().indexOf("ALTER TABLE ") > -1 ||
            x.toUpperCase().indexOf("DROP TABLE ") > -1 ||
            x.toUpperCase().indexOf("INTO ") > -1 ||
            x.toUpperCase().indexOf("CREATE TABLE IF NOT EXISTS ") > -1 ||
            x.toUpperCase().indexOf("ALTER TABLE ") > -1 ||
            x.toUpperCase().indexOf("CREATE VIEW ") > -1 ||
            x.toUpperCase().indexOf("REPLACE VIEW ") > -1 ||
            x.toUpperCase().indexOf("DROP VIEW ") > -1 ||
            (x.toUpperCase().indexOf("CREATE INDEX") > -1) ||
            (x.toUpperCase().indexOf("CREATE UNIQUE INDEX") > -1) ||
            (x.toUpperCase().indexOf("DROP INDEX") > -1)
            ) {
            return true;
        }
        return false;
    }

    this.ExecuteSQL = function (sql) {

        var resultContainer;
        resultContainer = document.getElementById("ExpensesOfTheDay");
        resultContainer.innerHTML = "";

        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {

                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
                if (len > 0) {
                    wst = "";
                    wst = wst + "<div id='mCSB_5' class='mCustomScrollBox mCS-light mCSB_horizontal mCSB_inside' tabindex='0' style='color:#222;max-height: none;overflow:auto'>";
                    wst = wst + "<table class=''><tr>";
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }
                    for (j = 0; j < columns.length; j++) {
                        wst = wst + "<th style='font-weight: bold;'>" + columns[j] + "</th>";
                    }
                    wst = wst + "</tr>";
                    for (i = 0; i < len; i++) {
                        wst = wst + "<tr>";
                        for (j = 0; j < columns.length; j++) {
                            if (results.rows.item(i)[columns[j]] == null) {
                                wst = wst + "<td><i>null</i></td>";
                            } else {
                                if (j == 0) {
                                    wst = wst + "<td>" + "<input style='background-color:#fa3e3e;color:white;font-weight:bold;border-radius:15px;' class=\"" + results.rows.item(i)[columns[j]] + "\"" + "id=\"btnDelete\" value=\"DELETE\" type=\"button\" onclick=\"getDataForDelete()\">" + "</button>" + "</td>";
                                }
                                else {
                                    wst = wst + "<td>" + results.rows.item(i)[columns[j]] + "</a>" + "</td>";
                                }
                            }
                        }
                        wst = wst + "</tr>";
                    }
                    resultContainer.innerHTML = wst + "</table></div>";
                } else {
                    DBChanges = checkDBChanges(sql);

                }
                //w3DBObj.myDatabase();
                document.getElementById("amount").value = "";
                document.getElementById("category").value = "";
                document.getElementById("remarks").value = "";
            }
            );
        }
            , function (err) {
                window.alert("Error 1: " + err.message);
            }
        );
    };

    this.selectStar = function (tablename) {
        var sql = "SELECT * FROM [" + tablename + "]";
        document.getElementById("textareaCodeSQL").value = sql;
        if (window.editor) {
            window.editor.getDoc().setValue(sql);
        }
        DBObj.ExecuteSQL(sql);
    };
    //SQL LITE FUNCTIONS End




    //INITIALIZATION Start
    this.InitDatabase = function (n) {

        DBObj.InitExpenses();
        DBObj.InitBudgetLogData();
        DBObj.InitSystemSettings();
        DBObj.InitTargetSettings();
    };

    this.ClearDatabase = function () {
        var warn = window.confirm("This action will restore the database back to its original content.\n\nAre you sure you want to continue?");
        if (warn === false) {
            return false;
        }
        document.getElementById("divResultSQL").innerHTML = "";
        if (Database) {
            Database.transaction(function (ws) {
                ws.executeSql("SELECT name FROM sqlite_master WHERE type='index' AND name<>'sqlite_autoindex___WebKitDatabaseInfoTable___1'", [], function (ws, results) {
                    var len = results.rows.length, i;
                    if (len > 0) {
                        for (i = 0; i < len; i++) {
                            DropIndex(results.rows.item(i).name);
                        }
                    }
                }
                );
                ws.executeSql("SELECT name FROM sqlite_master WHERE type='view'", [], function (ws, results) {
                    var len = results.rows.length, i;
                    if (len > 0) {
                        for (i = 0; i < len; i++) {
                            DropView(results.rows.item(i).name);
                        }
                    }
                }
                );
                ws.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name<>'sqlite_sequence' AND name<>'__WebKitDatabaseInfoTable__'", [], function (ws, results) {
                    var len = results.rows.length, i;
                    if (len > 0) {
                        for (i = 0; i < len; i++) {
                            DropTable(results.rows.item(i).name);
                            if (i === (len - 1)) { DBObj.InitDatabase(1); }
                        }
                    } else {
                        DBObj.InitDatabase(1);
                    }
                }
                );
            }
                , function (err) {
                    window.alert("Error 2: " + err.message);
                }
            );
        }
    };

    this.InitExpenses = function () {
        Database.transaction(function (ws) {
            ws.executeSql('CREATE TABLE IF NOT EXISTS Expenses (RecordID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,Amount NVARCHAR(255),Category NVARCHAR(255),Remarks NVARCHAR(255),Date NVARCHAR(255))', [], function (ws) {
            }
            );
        }
            , function (err) {
                if (err.message.indexOf("Shippers already exists") === -1) {
                    window.alert("Error 11: " + err.message);
                }
            }
        );
    };

    this.InitBudgetLogData = function () {
        Database.transaction(function (ws) {
            ws.executeSql('CREATE TABLE IF NOT EXISTS BudgetLogData (DailyBudget NVARHCHAR(255),DisposableSavingsFromBudget NVARCHAR(255),HourValue NVARCHAR(255),Date NVARCHAR(255),Time NVARCHAR(255))', [], function (ws) {
                var utc = new Date().toDateString();

                ws.executeSql('INSERT INTO BudgetLogData (DailyBudget,HourValue,Date) VALUES ("0","0","Wed Oct 31 2018")');
            }
            );
        }
            , function (err) {
                if (err.message.indexOf("Shippers already exists") === -1) {
                    window.alert("Error 12: " + err.message);
                }
            }
        );
    };

    this.InitSystemSettings = function () {
        Database.transaction(function (ws) {
            ws.executeSql('CREATE TABLE IF NOT EXISTS SystemSettings (Code NVARCHAR(255),Value1 NVARCHAR(255),Value2 NVARCHAR(255))', [], function (ws) {
                ws.executeSql('INSERT INTO SystemSettings (Code,Value1,Value2) VALUES ("Budget","0","0")');
                ws.executeSql('INSERT INTO SystemSettings (Code,Value1,Value2) VALUES ("SelectedDailyBudget","0","")');
                ws.executeSql('INSERT INTO SystemSettings (Code,Value1,Value2) VALUES ("SelectedHourlyBudget","0","")');
                ws.executeSql('INSERT INTO SystemSettings (Code,Value1,Value2) VALUES ("Mortality","Custom","")');
                ws.executeSql('INSERT INTO SystemSettings (Code,Value1,Value2) VALUES ("DailyAvailableBudget","0","Mon Nov 19 2018")');
                ws.executeSql('INSERT INTO SystemSettings (Code,Value1,Value2) VALUES ("StartHour","12:00AM","")');
                ws.executeSql('INSERT INTO SystemSettings (Code,Value1,Value2) VALUES ("IsAlive","0","")');

            }
            );
        }
            , function (err) {
                if (err.message.indexOf("Shippers already exists") === -1) {
                    window.alert("Error 13: " + err.message);
                }
            }
        );
    };

    this.InitTargetSettings = function () {
        Database.transaction(function (ws) {
            ws.executeSql('CREATE TABLE IF NOT EXISTS TargetSettings (ExpenseCategory NVARCHAR(255),Target NVARCHAR(255))', [], function (ws) {
                ws.executeSql('INSERT INTO TargetSettings (ExpenseCategory,Target) VALUES ("Food","")');
                ws.executeSql('INSERT INTO TargetSettings (ExpenseCategory,Target) VALUES ("Snacks","")');
                ws.executeSql('INSERT INTO TargetSettings (ExpenseCategory,Target) VALUES ("Apparels","")');
                ws.executeSql('INSERT INTO TargetSettings (ExpenseCategory,Target) VALUES ("Home/Estate Expenses","")');
                ws.executeSql('INSERT INTO TargetSettings (ExpenseCategory,Target) VALUES ("Transportation","")');
                ws.executeSql('INSERT INTO TargetSettings (ExpenseCategory,Target) VALUES ("Vices","")');
                ws.executeSql('INSERT INTO TargetSettings (ExpenseCategory,Target) VALUES ("Hygiene","")');
                ws.executeSql('INSERT INTO TargetSettings (ExpenseCategory,Target) VALUES ("Others","")');
            }
            );
        }
            , function (err) {
                if (err.message.indexOf("Shippers already exists") === -1) {
                    window.alert("Error 13: " + err.message);
                }
            }
        );
    };
    //INITIALIZATION End




    //MAIN Start
    this.ExecuteSQLSTART = function (sql) {
        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {

                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
                if (len > 0) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }

                    var budget = results.rows.item(0)[columns[0]];
                    var nulldailybudget = results.rows.item(0)[columns[1]];
                    var utc = new Date().toDateString();
                    var dt = new Date();
                    var hourTime = dt.getHours();

                    var CurrentDate = dt.getDate();
                    var CurrentHour = parseFloat(dt.getHours());

                    var expenseCount = results.rows.item(0)[columns[2]]
                    if (expenseCount == null || expenseCount == "") {
                        expenseCount = 0;
                    }

                    DBObj.ExecuteSQL("SELECT RecordID AS '',Amount,Category,Remarks,Date FROM Expenses WHERE Date = '" + utc + "'");

                    DBObj.ExecuteSQLAvailableBudgetSTART("SELECT Value2,CASE WHEN B.Mortality='Custom' THEN Gen2 ELSE IFNULL(Gen,0) END AS Gen  FROM ( "
                                                         + " SELECT A.Value2,CAST ((B.Budget-C.Expense)/(abs(round(julianday('now','localtime') - julianday(date('now','localtime','start of month','+1 month','-1 day'))))) AS INT) AS Gen,(B.Budget-C.Expense)/(D.CustomMortality) AS Gen2   FROM SystemSettings AS A "
                                                         + " LEFT JOIN "
                                                         + " ( "
                                                         + " SELECT Value1 AS Budget FROM SystemSettings WHERE Code='Budget' "
                                                         + " ) AS B "
                                                         + " LEFT JOIN "
                                                         + " ( "
                                                         + " SELECT SUM(Amount) AS Expense FROM Expenses "
                                                         + " ) AS C "
                                                         + " LEFT JOIN"
                                                         + " ("
                                                         + " SELECT Value2 AS CustomMortality FROM SystemSettings WHERE Code='Mortality'"
                                                         + " ) AS D"
                                                         + " WHERE A.Code = 'DailyAvailableBudget' LIMIT 1 ) AS A "
                                                         + " LEFT JOIN "
                                                         + " ("
                                                         + " SELECT Value1 AS Mortality FROM SystemSettings WHERE Code='Mortality'"
                                                         + " ) AS B", expenseCount);

                   

                } else {
                    DBChanges = checkDBChanges(sql);

                }
            }
            );
        }
            , function (err) {
                window.alert("Error 2: " + err.message);
            }
        );
    };
    //MAIN End



    //AVAILABLEBUDGET Start
    this.ExecuteSQLAvailableBudgetSTART = function (sql, expenseCount) {
        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {
                var len = results.rows.length, m, columns = [], DBChanges = 0;
                var totsal;
                var genbudg;
                if (len > 0) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }
                    //FOR AVAILABLE BUDGET Start
                    var SystemDate = results.rows.item(0)[columns[0]];
                    var autoAllocated = results.rows.item(0)[columns[1]];
                    var day = SystemDate.split(' ')[2];
                    var month = SystemDate.split(' ')[1];
                    var year = parseFloat(SystemDate.split(' ')[3]);

                    if (month == "Jan") { month == 0 }
                    else if (month == "Feb") { month = 1 }
                    else if (month == "Mar") { month = 2 }
                    else if (month == "Apr") { month = 3 }
                    else if (month == "May") { month = 4 }
                    else if (month == "Jun") { month = 5 }
                    else if (month == "Jul") { month = 6 }
                    else if (month == "Aug") { month = 7 }
                    else if (month == "Sep") { month = 8 }
                    else if (month == "Oct") { month = 9 }
                    else if (month == "Nov") { month = 10 }
                    else if (month == "Dec") { month = 11 }


                    var finalprevdate = new Date();
                    finalprevdate.setYear(parseInt(year));
                    finalprevdate.setMonth(parseInt(month));
                    finalprevdate.setDate(parseInt(day));


                    function calcDate(date1, date2) {
                        var diff = Math.floor(date1.getTime() - date2.getTime());
                        var day = 1000 * 60 * 60 * 24;

                        var days = Math.floor(diff / day);
                        var months = Math.floor(days / 31);
                        var years = Math.floor(months / 12);

                        var message = days;
                        return message
                    }
                    var today = new Date();

                    var daysDiff = calcDate(today, finalprevdate);
                    if (daysDiff == 0) { daysDiff = 1 }
                    //FOR AVAILABLE BUDGET End




                    //FOR GENERATED BUDGET Start
                    var hoursDiff;

                    var trailing_chars = SystemDate.slice(-3, -1);

                    if (trailing_chars[0] != " " && (trailing_chars[0] == "p" || trailing_chars[0] == "a")) {
                        SystemDate = SystemDate.slice(0, SystemDate.length - 2) + " " + SystemDate.slice(-2);
                    }

                    var date_parse_fail = false;

                    var birth_time_since_unix_epoch = Date.parse(SystemDate);

                    if (!isNaN(birth_time_since_unix_epoch)) {
                        var right_this_freaking_instant = Date.parse(new Date());

                        hoursDiff = (right_this_freaking_instant - birth_time_since_unix_epoch) / 1000

                        hoursDiff = Math.floor(calculate_age(hoursDiff));
                    }

                    //FOR GENERATED BUDGET End




                    DBObj.ExecuteSQLGetRemainingAvailableBudget("SELECT A.Value1 * " + daysDiff + " - IFNULL(B.Amount,0) AS VAR, C.Value2 * " + hoursDiff + " - IFNULL(B.Amount,0) AS VAR2 ,C.Value1 - IFNULL(B.Amount,0) AS VAR3"
                                                            + " FROM  "
                                                            + " (    "
                                                            + " SELECT Value1 FROM SystemSettings WHERE Code='DailyAvailableBudget' "
                                                            + " ) AS A   "
                                                            + " LEFT JOIN   "
                                                            + " (   "
                                                            + " SELECT SUM(Amount) AS Amount FROM Expenses   "
                                                            + " ) AS B "
                                                            + " LEFT JOIN  "
                                                            + " ( "
                                                            + " SELECT Value1,Value2 FROM SystemSettings WHERE Code='Budget' "
                                                            + " ) AS C", expenseCount);
                    //SETTINS Start
                    DBObj.ExecuteSQLSettingsStart("SELECT Value1,Value2 FROM SystemSettings WHERE Code IN ('Budget','SelectedDailyBudget','SelectedHourlyBudget','Mortality','StartHour')");
                    //SETTINS End


                    //MODAL STATUS Start
                    DBObj.ExecuteSQLCheckStatus("SELECT A.Value2 * "+hoursDiff+" - IFNULL(B.Amount,0),A.Value2 ,C.Mortality,C.CustomMortality"
                                             + " FROM SystemSettings AS A "
                                             + " LEFT JOIN "
                                             + " ( "
                                             + " SELECT SUM(Amount) AS Amount FROM Expenses "
                                             + " ) AS B "
                                             + " LEFT JOIN"
                                             + " ("
                                             + " SELECT Value1 AS Mortality,Value2 AS CustomMortality FROM SystemSettings WHERE Code = 'Mortality'"
                                             + " ) AS C"
                                             + " WHERE Code = 'Budget'",autoAllocated);
                    //MODAL STATUS End

                    




                } else {
                    DBChanges = checkDBChanges(sql);
                }
            }
            );
        }
            , function (err) {
                window.alert("Error 3: " + err.message);
            }
        );
    };

    this.ExecuteSQLGetRemainingAvailableBudget = function (sql, expenseCount) {
        var resultContainer = document.getElementById("RemainingAvailableBudget");
        var resultContainer2 = document.getElementById("expenseCount");
        var resultContainer3 = document.getElementById("test");
        var resultContainer4 = document.getElementById("Remaining");
        var txt = "";
        var txt2 = "";
        var txt3 = "";

        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {
                var len = results.rows.length, m, columns = [], DBChanges = 0;
                var totsal;
                var genbudg;
                if (len > 0) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }
                    var Available = parseFloat(results.rows.item(0)[columns[0]]);
                    var Generated = parseFloat(results.rows.item(0)[columns[1]]);
                    var Remaining = parseFloat(results.rows.item(0)[columns[2]]);

                    if (Available > 0) {
                        txt = "<div style='color:#75ab4b' class='numb' data-from='0' data-to=" + Available + " data-speed='1000' data-waypoint-active='yes'>" + Available + "</div>";
                    } else {
                        txt = "<div style='color:#fa3e3e;' class='numb' data-from='0' data-to=" + Available + " data-speed='1000' data-waypoint-active='yes'>" + Available + "</div>";
                    }


                    resultContainer.innerHTML = txt;
                    resultContainer2.innerHTML = expenseCount;

                    if (Generated > 0) {
                        txt2 = "<div style='color:#75ab4b' class='numb' data-from='0' data-to=" + Generated + " data-speed='1000' data-waypoint-active='yes'>" + Generated + "</div>";
                    } else {
                        txt2 = "<div style='color:#fa3e3e;' class='numb' data-from='0' data-to=" + Generated + " data-speed='1000' data-waypoint-active='yes'>" + Generated + "</div>";
                    }
                    resultContainer3.innerHTML = txt2;

                    txt3 = "<div style='color: #222;' class='numb' data-from='0' data-to=" + Remaining + " data-speed='1000' data-waypoint-active='yes'>" + Remaining + "</div>";
                    resultContainer4.innerHTML = txt3;

                } else {
                    DBChanges = checkDBChanges(sql);
                }
            }
            );
        }
            , function (err) {
                window.alert("Error 3: " + err.message);
            }
        );
    };

    this.ExecuteSQLGetRemainingAvailableBudgetDiffDay = function (sql, expenseCount, factor, daysdiff) {
        var resultContainer = document.getElementById("RemainingAvailableBudget");
        var resultContainer2 = document.getElementById("expenseCount");
        var txt = "";
        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {
                var len = results.rows.length, m, columns = [], DBChanges = 0;
                if (len > 0) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }
                    var NewDailyAvailable = results.rows.item(0)[columns[0]]

                    txt = "<div class='numb' data-from='0' data-to=" + NewDailyAvailable + " data-speed='1000' data-waypoint-active='yes'>" + NewDailyAvailable + "</div>";

                    resultContainer.innerHTML = txt;
                    resultContainer2.innerHTML = expenseCount;
                } else {
                    DBChanges = checkDBChanges(sql);
                }

            }
            );
        }
            , function (err) {
                window.alert("Error 3: " + err.message);
            }
        );
    };
    //AVAILABLEBUDGET End





    //STATUS Start
    this.ExecuteSQLCheckStatus = function (sql,autoallocated) {
        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {

                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
                if (len > 0) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }
                    var DailyBudget = parseFloat(results.rows.item(0)[columns[0]]);
                    var SettingRate = parseFloat(results.rows.item(0)[columns[1]]);
                    var Mortality = results.rows.item(0)[columns[2]]
                    var CustomMortality = parseFloat(results.rows.item(0)[columns[3]]);

                    var tempDailyBuget = DailyBudget;
                    var tempDailyBuget2 = DailyBudget * -1;
                    var counter = 0;
                    var counter2 = 0;

                    if (DailyBudget >= 0) {
                        return;
                    }

                    while (tempDailyBuget < 0) {
                        tempDailyBuget = tempDailyBuget + SettingRate;
                        counter++;
                    }
                    counter = counter - 1;

                    var counterTemp = counter;
                    while (counterTemp > 0) {
                        counterTemp = counterTemp - 24;
                        counter2++;
                    }

                    var today = new Date();
                    var lateDate = today.getDate() + counter2;

                    today.setDate(lateDate);
                    var finalToday = today.toDateString();

                    if (Mortality == "Monthly") {
                        Mortality = "TO SURVIVE THE MONTH"
                    }
                    else if (Mortality == "Weekly") {
                        Mortality = "TO SURVIVE THE WEEK"
                    }
                    else if (Mortality == "Custom") {
                        var date = new Date();

                        var customDate = new Date(date);
                        customDate.setDate(customDate.getDate() + CustomMortality);
                        
                        customDate.toDateString();

                        Mortality = "TO SURVIVE UNTIL " + customDate.toDateString();
                    }

                    document.getElementById("status").innerHTML = "<div class='dialog-ovelay fadeIn'><div class='dialog zoomIn'><header> <center><h3 style='font-weight: bolder;color:red'> ATTENTION </h3></center> <i class='fa fa-close'></i></header><div class='dialog-msg'><center><p>GENERATED BUDGET(" + DailyBudget + ")</p><br /><p>" + counter + " HOURS TO BREAK EVEN</p><br /><p style='line-height:25px;'>BUDGET IS " + counter2 + " DAYS ADVANCE</p><p>(" + finalToday + ")</p><br /><br /><p style='line-height:16px;'>AUTO ALLOCATED BUDGET "+ Mortality +"</p><p style='line-height:25px;'>(" + autoallocated + ")</p></center></div><footer><div class='controls'> <button class='button button-primary-flat doAction'>OK</button></div></footer></div></div>";
                    document.getElementById("isActiveAlert").value = "1"


                    $('body').off('click', '.doAction');
                    $('body').on('click', '.doAction', function () {
                        $(this).parents('.dialog-ovelay').find('.dialog').removeClass('zoomIn').addClass('zoomOut');
                        $(this).parents('.dialog-ovelay').fadeOut(function () {
                            $(this).remove();
                            document.getElementById("isActiveAlert").value = ""
                        });
                        //action();
                    });

                    $('.cancelAction, .fa-close').click(function () {
                        $(this).parents('.dialog-ovelay').find('.dialog').removeClass('zoomIn').addClass('zoomOut');
                        $(this).parents('.dialog-ovelay').fadeOut(function () {
                            $(this).remove();
                            document.getElementById("isActiveAlert").value = ""
                        });
                    });
                } else {
                    DBChanges = checkDBChanges(sql);

                }
            }
            );
        }
            , function (err) {
                window.alert("Error 2: " + err.message);
            }
        );
    };
    //STATUS End





    //FRONT END USES Start
    this.ExecuteSQLSettings = function (sql) {

        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {

                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
                if (len > 0) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }

                    document.getElementById("CurrentTotalRemaining").innerText = "Initial Budget : " + results.rows.item(0)[columns[0]];
                    document.getElementById("CurrentRatePerHour").innerText = "Rate : " + results.rows.item(0)[columns[1]];

                } else {
                    DBChanges = checkDBChanges(sql);

                }
            }
            );
        }
            , function (err) {
                window.alert("Error SystemSettings: " + err.message);
            }
        );
    };
    //FRONT END USES End



    //LOG EXPENSE BUTTON Start
    this.runSQL = function (n) {
        Database.transaction(function (ws) {
            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                var amount = document.getElementById("amount").value;
                var category = document.getElementById("category").value;
                var remarks = document.getElementById("remarks").value;
                var utc = new Date().toDateString();

                if (amount != "" && category != "" && remarks != "") {
                    if (checkInp()) {
                        if (category != "Food" &&
                            category != "Snacks" &&
                            category != "Apparels" &&
                            category != "Home/Estate Expenses" &&
                            category != "Transportation" &&
                            category != "Vices" &&
                            category != "Hygiene" &&
                            category != "Others") {
                            //alert("Please select valid Category")
                            $("#invalidcat").click();
                            return;
                        }
                        var sql = "INSERT INTO EXPENSES (AMOUNT,CATEGORY,REMARKS,DATE) VALUES ('" + amount + "','" + category + "','" + remarks + "','" + utc + "')";
                    }
                    else {
                        //alert("Please populate all fields");
                        //$("#populatefield").click();
                        return;
                    }
                }
                else {
                    //alert("Please populate all fields");
                    $("#populatefield").click();
                    return;
                }
                DBObj.ExecuteSQL(sql);
                DBObj.ExecuteSQLSTART("SELECT A.Value1,B.DailyBudget,C.Cnt "
                                    + " FROM "
                                    + " SystemSettings "
                                    + " AS A "
                                    + " LEFT JOIN (SELECT DailyBudget FROM BudgetLogData WHERE RowID=(SELECT MAX(RowID) FROM BudgetLogData)) AS B "
                                    + " LEFT JOIN (SELECT SUM(Amount) AS Cnt FROM Expenses WHERE Date = '" + dateToday + "') AS C "
                                    + " WHERE A.Code = 'Budget'"
                                    + " LIMIT 1")
                //DBObj.ExecuteSQLFunction2("SELECT DailyBudget FROM BudgetLogData WHERE RowID=(SELECT MAX(RowID) FROM BudgetLogData)", amount);
            }

            );
        }
            , function (err) {
                DBObj.InitDatabase(0);
            }
        );
    };

    this.ExecuteSQLFunction2 = function (sql, amount, amountToSave) {
        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {
                var len = results.rows.length, m, columns = [], DBChanges = 0;
                if (len > 0) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }
                    if (amount != 0) {
                        var budgToUpdate = parseFloat(results.rows.item(0)[columns[0]]);
                        var newBudg = budgToUpdate - amount;

                        DBObj.ExecuteSQLFunction2("SELECT Time FROM BudgetLogData ORDER BY Time DESC LIMIT 1", 0, newBudg);
                    }
                    else if (amount == 0) {
                        var timeAsID = results.rows.item(0)[columns[0]].toString();
                        DBObj.ExecuteSQLFunction2("UPDATE BudgetLogData SET DailyBudget='" + amountToSave + "' WHERE RowID=(SELECT MAX(RowID) FROM BudgetLogData)", 1)
                        DBObj.ExecuteSQLSTART("SELECT A.Value1,B.DailyBudget,C.Cnt "
                                            + " FROM "
                                            + " SystemSettings "
                                            + " AS A "
                                            + " LEFT JOIN (SELECT DailyBudget FROM BudgetLogData WHERE RowID=(SELECT MAX(RowID) FROM BudgetLogData)) AS B "
                                            + " LEFT JOIN (SELECT SUM(Amount) AS Cnt FROM Expenses WHERE Date = '" + dateToday + "') AS C "
                                            + " WHERE A.Code = 'Budget'"
                                            + " LIMIT 1")
                    }
                } else {
                    DBChanges = checkDBChanges(sql);
                }
            }
            );
        }
            , function (err) {
                window.alert("Error 6: " + err.message);
            }
        );
    };
    //LOG EXPENSE BUTTON End




    //DELETE EXPENSE Start
    this.DeleteSQL = function (n) {
        Database.transaction(function (ws) {
            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                var sql = "SELECT Amount FROM Expenses WHERE RECORDID='" + n + "'";
                DBObj.ExecuteSelectDeleteSQL(sql, 1, n);

                DeleteDelay();
            }
            );
        }
            , function (err) {
                DBObj.InitDatabase(0);
            }
        );
    };

    this.ExecuteSelectDeleteSQL = function (sql, factor, xvar) {

        var resultContainer;
        resultContainer = document.getElementById("ExpensesOfTheDay");
        resultContainer.innerHTML = "";

        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {

                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;

                if (factor == 1) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }
                    var AmountToLess = parseFloat(results.rows.item(0)[columns[0]]);
                    DBObj.ExecuteSelectDeleteSQL("DELETE FROM Expenses WHERE RecordID = '" + xvar + "'", 2, AmountToLess);
                }

                //w3DBObj.myDatabase();
                document.getElementById("amount").value = "";
                document.getElementById("category").value = "";
                document.getElementById("remarks").value = "";
            }
            );
        }
            , function (err) {
                window.alert("Error 10: " + err.message);
            }
        );
    };

    function DeleteDelay() {
        setTimeout(
          function () {
              DBObj.ExecuteSQLSTART("SELECT A.Value1,B.DailyBudget,C.Cnt "
                                    + " FROM "
                                    + " SystemSettings "
                                    + " AS A "
                                    + " LEFT JOIN (SELECT DailyBudget FROM BudgetLogData WHERE RowID=(SELECT MAX(RowID) FROM BudgetLogData)) AS B "
                                    + " LEFT JOIN (SELECT SUM(Amount) AS Cnt FROM Expenses WHERE Date = '" + dateToday + "') AS C "
                                    + " WHERE A.Code = 'Budget'"
                                    + " LIMIT 1")
          }, 1000);
    }
    //DELETE EXPENSE End



    //MULTI FORM FUNCTIONS Start
    this.runInitSQL1 = function (n) {
        Database.transaction(function (ws) {

            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                DBObj.ExecuteSQLSTART("SELECT A.Value1,B.DailyBudget,C.Cnt "
                                    + " FROM "
                                    + " SystemSettings "
                                    + " AS A "
                                    + " LEFT JOIN (SELECT DailyBudget FROM BudgetLogData WHERE RowID=(SELECT MAX(RowID) FROM BudgetLogData)) AS B "
                                    + " LEFT JOIN (SELECT SUM(Amount) AS Cnt FROM Expenses WHERE Date = '" + dateToday + "') AS C "
                                    + " WHERE A.Code = 'Budget'"
                                    + " LIMIT 1")
            }
            );
        }
            , function (err) {
                DBObj.InitDatabase(0);
            }
        );
    };

    this.runInitSQL2 = function (n) {
        Database.transaction(function (ws) {
            var budget = 10000;
            var utc = new Date().toDateString();
            var dt = new Date();
            var hourTime = dt.getHours();

            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                DBObj.ExecuteSQLSettings("SELECT * FROM SystemSettings")
            }
            );
        }
            , function (err) {
                DBObj.InitDatabase(0);
            }
        );
    };


    //PreIndex Start
    this.runInitSQLPreIndex = function (n) {
        Database.transaction(function (ws) {
            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                DBObj.ExecuteSQLPreIndex("SELECT Value1 FROM SystemSettings WHERE Code = 'IsAlive' AND Value1 = '1'");
            }
            );
        }
            , function (err) {
                DBObj.InitDatabase(0);
            }
        );
    };
    this.ExecuteSQLPreIndex = function (sql) {
        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {

                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
                if (len > 0) {
                    window.location = "index.html"
                } else {
                    window.location = "Register.html"
                }
            }
            );
        }
            , function (err) {
                window.alert("Error 2: " + err.message);
            }
        );
    };
    //PreIndex End



    
    //Registered Start
    this.runInitSQLRegister = function (n) {
        Database.transaction(function (ws) {
            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                DBObj.ExecuteSQLRegister("UPDATE SystemSettings SET Value1 = '1' WHERE Code = 'IsAlive'");
            }
            );
        }
            , function (err) {
                DBObj.InitDatabase(0);
            }
        );
    };
    this.ExecuteSQLRegister = function (sql) {
        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {

                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
                window.location = "index.html"
            }
            );
        }
            , function (err) {
                window.alert("Error 2: " + err.message);
            }
        );
    };
    //Registered End

    //Settings Start
    this.runInitSQLSettings = function (n) {
        Database.transaction(function (ws) {

            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                DBObj.ExecuteSQLSettingsStart("SELECT Value1 FROM SystemSettings WHERE Code IN ('Budget','SelectedDailyBudget','SelectedHourlyBudget','Mortality','StartHour')")
            }
            );
        }
            , function (err) {
                DBObj.InitDatabase(0);
            }
        );
    };
    this.ExecuteSQLSettingsStart = function (sql) {
        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {
                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
                if (len > 0) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }
                    var total_budget = results.rows.item(0)[columns[0]];
                    var daily_budget = results.rows.item(1)[columns[0]];
                    var hourly_budget = results.rows.item(2)[columns[0]];
                    var mortality = results.rows.item(3)[columns[0]];
                    var custommortality = results.rows.item(3)[columns[1]];
                    var starthour = results.rows.item(4)[columns[0]];

                    //actual
                    document.getElementById("total_budget").value = total_budget;
                    document.getElementById("daily_budget").value = daily_budget;
                    document.getElementById("hourly_budget").value = hourly_budget;
                    document.getElementById("mortality").value = mortality;
                    if (mortality == "Custom") {
                        document.getElementById("hourvalue").value = custommortality
                        document.getElementById("customhour").style.display = "block";
                    }
                    else { document.getElementById("hourvalue").value = "";}
                    document.getElementById("starthour").value = starthour;

                    //holder
                    document.getElementById("holder_total_budget").value = total_budget;
                    document.getElementById("holder_daily_budget").value = daily_budget;
                    document.getElementById("holder_hourly_budget").value = hourly_budget;
                    document.getElementById("holder_mortality").value = mortality;
                    document.getElementById("holder_starthour").value = starthour;

                }
            }
            );
        }
            , function (err) {
                window.alert("Error 2: " + err.message);
            }
        );
    };

    this.runInitSQLApplyChanges = function (n) {
        Database.transaction(function (ws) {
            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                //get variables
                var total_budget = document.getElementById("total_budget").value;
                var daily_budget = document.getElementById("daily_budget").value;
                var hourly_budget = document.getElementById("hourly_budget").value;
                var mortality = document.getElementById("mortality").value;
                var hourvalue = document.getElementById("hourvalue").value;
                var starthour = document.getElementById("starthour").value;

                //update
                DBObj.runInitSQLApplyChangesStart("UPDATE SystemSettings SET Value1 = '" + total_budget + "' WHERE Code='Budget'")
                DBObj.runInitSQLApplyChangesStart("UPDATE SystemSettings SET Value1 = '" + daily_budget + "' WHERE Code='SelectedDailyBudget'")
                DBObj.runInitSQLApplyChangesStart("UPDATE SystemSettings SET Value1 = '" + daily_budget + "' WHERE Code='DailyAvailableBudget'")
                DBObj.runInitSQLApplyChangesStart("UPDATE SystemSettings SET Value2 = '" + hourly_budget + "' WHERE Code='Budget'")
                DBObj.runInitSQLApplyChangesStart("UPDATE SystemSettings SET Value2 = '" + dateToday + "' WHERE Code='DailyAvailableBudget'")
                DBObj.runInitSQLApplyChangesStart("UPDATE SystemSettings SET Value1 = '" + hourly_budget + "' WHERE Code='SelectedHourlyBudget'")
                DBObj.runInitSQLApplyChangesStart("UPDATE SystemSettings SET Value1 = '" + mortality + "' WHERE Code='Mortality'")
                DBObj.runInitSQLApplyChangesStart("UPDATE SystemSettings SET Value1 = '" + starthour + "' WHERE Code='StartHour'")

                if (mortality == "Custom") {
                    DBObj.runInitSQLApplyChangesStart("UPDATE SystemSettings SET Value2 = '" + hourvalue + "' WHERE Code='Mortality'")
                }
                else {
                    DBObj.runInitSQLApplyChangesStart("UPDATE SystemSettings SET Value2 = '" + 0 + "' WHERE Code='Mortality'")
                }

                //delete data
                DBObj.runInitSQLApplyChangesStart("DELETE FROM Expenses")

                //show modal
                showSuccess();
            }
            );
        }
            , function (err) {
                DBObj.InitDatabase(0);
            }
        );
    };
    this.runInitSQLApplyChangesStart = function (sql,factor) {
        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {
                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
            }
            );
        }
            , function (err) {
                window.alert("Error 2: " + err.message);
            }
        );
    };
    //Settings End

    //MULTI FORM FUNCTIONS End




    //FORM VALIDATION Start
    function checkInp() {
        var x = document.getElementById("amount").value;
        if (isNaN(x)) {
            $("#onlynumbers").click();
            return false;
        }
        return true;
    }

    function checkInp2() {
        var x = document.getElementById("totsal").value;
        var y = document.getElementById("rate").value;

        if (isNaN(x) && isNaN(y)) {
            $("#onlynumbers").click();
            return false;
        }
        return true;
    }
    //FORM VALIDATION End

    //HELPER FUNCTIONS Start
    function calculate_age(age_in_seconds) {
        var time_measurements = {
            seconds: age_in_seconds
        }
        time_measurements.electric_jiffies = time_measurements.seconds * 60;
        time_measurements.minutes = time_measurements.seconds / 60;
        time_measurements.hours = time_measurements.minutes / 60;

        return time_measurements.hours;

    }
    //HELPER FUNCTIONS End


    //FOR FUTURE PURPOSE Start
    this.ResetDatabase = function (n) {
        Database.transaction(function (ws) {
            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                var utc = new Date().toDateString();

                DBObj.ExecuteSQL("DELETE FROM Expenses");

                DBObj.ExecuteSQL("DELETE FROM BudgetLogData WHERE RowId != 1");
                DBObj.ExecuteSQL("UPDATE BudgetLogData SET Date = '" + utc + "'");
            }
            );
        }
            , function (err) {
                DBObj.InitDatabase(0);
            }
        );
    };
    //FOR FUTURE PURPOSE End
}
