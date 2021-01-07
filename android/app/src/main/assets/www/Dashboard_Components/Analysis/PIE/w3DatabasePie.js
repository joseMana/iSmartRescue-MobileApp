//SQL LITE FOR PIE
var Database;
var dateToday = new Date().toDateString();


function WebSQLInit() {
    var DBObj = this;
    Database = window.openDatabase('Database', '1.0', 'webDatabase', 2 * 1024 * 1024);
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
        resultContainer = document.getElementById("test2");
        resultContainer.innerHTML = "";

        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {

                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
                if (len > 0) {
                    wst = "";
                    wst = wst + "<div id='mCSB_5' class='mCustomScrollBox mCS-light mCSB_horizontal mCSB_inside' tabindex='0' style='max-height: none;overflow:auto;background-color:#18191c'>";
                    wst = wst + "<table class=''><tr>";
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }
                    for (j = 0; j < columns.length; j++) {
                        wst = wst + "<th>" + columns[j] + "</th>";
                    }
                    wst = wst + "</tr>";
                    for (i = 0; i < len; i++) {
                        wst = wst + "<tr>";
                        for (j = 0; j < columns.length; j++) {
                            if (results.rows.item(i)[columns[j]] == null) {
                                wst = wst + "<td><i>null</i></td>";
                            } else {
                                if (j == 0) {
                                    wst = wst + "<td>" + "<input class=\"" + results.rows.item(i)[columns[j]] + "\"" + "id=\"btnDelete\" value=\"DELETE\" type=\"button\" onclick=\"deletedata()\">" + "</button>" + "</td>";
                                }
                                else {
                                    wst = wst + "<td>" + "<a href=\"" + results.rows.item(i)[columns[j]] + "\"" + ">" + results.rows.item(i)[columns[j]] + "</a>" + "</td>";
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

    this.ExecuteSQLSettings = function (sql) {

        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {

                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
                if (len > 0) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }

                    document.getElementById("totsal").value = results.rows.item(0)[columns[0]];
                    document.getElementById("rate").value = results.rows.item(0)[columns[1]];

                } else {
                    DBChanges = checkDBChanges(sql);

                }
            }
            );
        }
            , function (err) {
                window.alert("Error 1: " + err.message);
            }
        );
    };

    this.ExecuteSQLDailyPieChart = function (sql) {
        Database.transaction(function (ws) {
            ws.executeSql(sql, [], function (ws, results) {

                var len = results.rows.length, i, j, m, wst, columns = [], DBChanges = 0;
                if (len > 0) {
                    for (m in results.rows.item(0)) {
                        columns.push(m);
                    }

                    var Apparels = results.rows.item(0)[columns[1]];
                    var Food = results.rows.item(1)[columns[1]];
                    var Home = results.rows.item(2)[columns[1]];
                    var Hygiene = results.rows.item(3)[columns[1]];
                    var Others = results.rows.item(4)[columns[1]];
                    var Snacks = results.rows.item(5)[columns[1]];
                    var Transportation = results.rows.item(6)[columns[1]];
                    var Vices = results.rows.item(7)[columns[1]];

                    //checking of nulls or empty
                    if (Apparels == "" || Apparels == null || isNaN(Apparels)) { Apparels = 0; }
                    if (Food == "" || Food == null || isNaN(Food)) { Food = 0; }
                    if (Home == "" || Home == null || isNaN(Home)) { Home = 0; }
                    if (Hygiene == "" || Hygiene == null || isNaN(Hygiene)) { Hygiene = 0; }
                    if (Others == "" || Others == null || isNaN(Others)) { Others = 0; }
                    if (Snacks == "" || Snacks == null || isNaN(Snacks)) { Snacks = 0; }
                    if (Transportation == "" || Transportation == null || isNaN(Transportation)) { Transportation = 0; }
                    if (Vices == "" || Vices == null || isNaN(Vices)) { Vices = 0; }



                    document.getElementById("Apparels").value = Apparels;
                    document.getElementById("Food").value = Food;
                    document.getElementById("Home").value = Home;
                    document.getElementById("Hygiene").value = Hygiene;
                    document.getElementById("Others").value = Others;
                    document.getElementById("Snacks").value = Snacks;
                    document.getElementById("Transportation").value = Transportation;
                    document.getElementById("Vices").value = Vices;


                    var a = parseFloat(results.rows.item(0)[columns[1]]); 
                    var b = parseFloat(results.rows.item(1)[columns[1]]); 
                    var c = parseFloat(results.rows.item(2)[columns[1]]); 
                    var d = parseFloat(results.rows.item(3)[columns[1]]); 
                    var e = parseFloat(results.rows.item(4)[columns[1]]); 
                    var f = parseFloat(results.rows.item(5)[columns[1]]); 
                    var g = parseFloat(results.rows.item(6)[columns[1]]); 
                    var h = parseFloat(results.rows.item(7)[columns[1]]);

                    document.getElementById("totalexpense").innerHTML = a + b + c + d + e + f + g + h;


                } else {
                    DBChanges = checkDBChanges(sql);

                }
            }
            );
        }
            , function (err) {
                window.alert("Error 1: " + err.message);
            }
        );
    };

    this.runInitSQL1 = function (n) {
        Database.transaction(function (ws) {
            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                DBObj.ExecuteSQLDailyPieChart("SELECT Category,SUM(Amount) FROM "
                                    + "("
                                    + " SELECT 'Apparels' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Food' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Home' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Hygiene' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Others' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Snacks' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Transportation' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Vices' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT Category,SUM(Amount) FROM Expenses WHERE Date='"+ dateToday +"' GROUP BY Category) AS A GROUP BY Category");
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
            ws.executeSql("SELECT * FROM sqlite_sequence", [], function () {
                DBObj.ExecuteSQLDailyPieChart("SELECT Category,SUM(Amount) FROM "
                                    + "("
                                    + " SELECT 'Apparels' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Food' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Home' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Hygiene' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Others' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Snacks' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Transportation' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT 'Vices' AS Category, 0 AS Amount"
                                    + " UNION ALL"
                                    + " SELECT Category,SUM(Amount) FROM Expenses GROUP BY Category) AS A GROUP BY Category");
            }
            );
        }
            , function (err) {
                DBObj.InitDatabase(0);
            }
        );
    };

}
