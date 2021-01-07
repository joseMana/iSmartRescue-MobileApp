var w3Database;

function w3WebSQLInit() {
    var w3DBObj = this;
    w3Database = window.openDatabase('Database', '1.0', 'webDatabase', 2 * 1024 * 1024);
    function w3DropTable(tablename) {
        var sql="DROP TABLE [" + tablename + "]";
        w3Database.transaction(function (tx)
            {
                tx.executeSql(sql,[]);
            }
            ,function (err) {
                //window.alert("Error 3: " + err.message);
            }
    
        );
    }
    function w3DropView(tablename) {
        var sql="DROP VIEW [" + tablename + "]";
        w3Database.transaction(function (tx)
            {
                tx.executeSql(sql,[]);
            }
            ,function (err) {
                //window.alert("Error 4: " + err.message);
            }
        );
    }
    function w3DropIndex(tablename) {
        var sql="DROP INDEX [" + tablename + "]";
        w3Database.transaction(function (tx)
            {
                tx.executeSql(sql,[]);
            }
            ,function (err) {
                //window.alert("Error 5: " + err.message);
            }
    
        );
    }
    function checkDBChanges(x) {
        if (
            x.toUpperCase().indexOf("INSERT INTO ")>-1 ||
            x.toUpperCase().indexOf("UPDATE ")>-1 ||
            x.toUpperCase().indexOf("DELETE ")>-1 ||
            x.toUpperCase().indexOf("ALTER TABLE ")>-1 ||
            x.toUpperCase().indexOf("DROP TABLE ")>-1 ||
            x.toUpperCase().indexOf("INTO ")>-1 ||
            x.toUpperCase().indexOf("CREATE TABLE ")>-1 ||
            x.toUpperCase().indexOf("ALTER TABLE ")>-1 ||
            x.toUpperCase().indexOf("CREATE VIEW ")>-1 ||        
            x.toUpperCase().indexOf("REPLACE VIEW ")>-1 ||
            x.toUpperCase().indexOf("DROP VIEW ")>-1 ||
            (x.toUpperCase().indexOf("CREATE INDEX")>-1 ) ||
            (x.toUpperCase().indexOf("CREATE UNIQUE INDEX")>-1 ) ||        
            (x.toUpperCase().indexOf("DROP INDEX")>-1 )        
            ) {
            return true;
        }
        return false;
    }
    this.w3ExecuteSQL = function(sql) {
        var resultContainer;
        resultContainer = document.getElementById("divResultSQL");
        resultContainer.innerHTML = "";
        w3Database.transaction(function (tx)
            {
                tx.executeSql(sql,[],function (tx, results)
                    {
                        var len = results.rows.length, i, j, m, txt, columns = [], DBChanges = 0;
                        if (len > 0) {
                            txt = "";
                            txt = txt + "<div style='padding:10px;'><div style='margin-bottom:10px;'>Number of Records: " + len + "</div>";
                            txt = txt + "<table class='w3-table-all notranslate'><tr>";
                            for (m in results.rows.item(0)) {
                                columns.push(m);
                            }
                            for (j = 0; j < columns.length; j++) {
                                txt = txt + "<th>" + columns[j] + "</th>";  
                            }
                            txt = txt + "</tr>";
                            for (i = 0; i < len; i++) {
                                txt = txt + "<tr>";       
                                for (j = 0; j < columns.length; j++) {
                                    if (results.rows.item(i)[columns[j]] == null) {
                                        txt = txt + "<td><i>null</i></td>";  
                                    } else {
                                        txt = txt + "<td>" + results.rows.item(i)[columns[j]] + "</td>";
                                    }                                    
                                }
                                txt = txt + "</tr>";       
                            }
                            resultContainer.innerHTML =  txt + "</table></div>";
                        } else {
                            DBChanges = checkDBChanges(sql);
                            if (DBChanges === true) {
                                txt = "<div style='padding:10px;'>You have made changes to the database.";
                                if (results.rowsAffected > 0) {txt = txt + " Rows affected: " + results.rowsAffected; }
                                resultContainer.innerHTML = txt + "</div>";
                            } else {
                                txt = "<div style='padding:10px;'>No result.</div>";
                                resultContainer.innerHTML = txt;
                            }
                        }
                        w3DBObj.myDatabase();
                    }
                );
            }
            ,function (err) {
                //window.alert("Error 1: " + err.message);
            }
        );
    };
    this.selectStar = function (tablename) {
        var sql = "SELECT * FROM [" + tablename + "]";
        document.getElementById("textareaCodeSQL").value = sql;
        if (window.editor) {
          window.editor.getDoc().setValue(sql);
        }
        w3DBObj.w3ExecuteSQL(sql);
    };
    this.myDatabase = function () {
        w3Database.transaction(function (tx)
            {
                var tblnames = [], recordcounts = [], viewnames = [], viewrecordcounts = [], indexnames = [];
                document.getElementById("yourDB").innerHTML = "";
                document.getElementById("yourRC").innerHTML = "";
                document.getElementById("yourIX").innerHTML = "";                
                function w3DBInfo() {
                    var txt = "", i;
                    txt = txt + "<table width='100%' xclass='w3-table-all notranslate'><tr>";
                    txt = txt + "<th style='text-align:left;'>Tablename</th>";  
                    txt = txt + "<th style='text-align:right;'>Records</th>";                          
                    txt = txt + "</tr>";
                    for (i = 0; i < tblnames.length; i++) {
                        txt = txt + "<tr>";       
                        txt = txt + "<td title='Click to see the content of the " + tblnames[i] + " table' style='text-align:left;cursor:pointer;text-decoration:underline;' onclick='w3schoolsWebSQL1.selectStar(\"" + tblnames[i] + "\")'>" + tblnames[i] + "</td>";  
                        txt = txt + "<td style='text-align:right;'>" + recordcounts[i] + "</td>";                  
                        txt = txt + "</tr>";       
                    }
                    document.getElementById("yourDB").innerHTML =  txt + "</table>";
                }
                function w3DBViewInfo() {
                    var txt = "", i;
                    txt = txt + "<h4>Views:</h4>";
                    txt = txt + "<table width='100%' xclass='w3-table-all notranslate'><tr>";
                    txt = txt + "<th style='text-align:left;'>Name of View</th>";  
                    txt = txt + "<th style='text-align:right;'>Records</th>";                          
                    txt = txt + "</tr>";
                    for (i = 0; i < viewnames.length; i++) {
                        txt = txt + "<tr>";       
                        txt = txt + "<td title='Click to see the content of the " + viewnames[i] + " view' style='text-align:left;cursor:pointer;text-decoration:underline;' onclick='w3schoolsWebSQL1.selectStar(\"" + viewnames[i] + "\")'>" + viewnames[i] + "</td>";  
                        txt = txt + "<td style='text-align:right;'>" + viewrecordcounts[i] + "</td>";                  
                        txt = txt + "</tr>";       
                    }
                    document.getElementById("yourRC").innerHTML =  txt + "</table>";
                }
                function w3DBIndexInfo() {
                    var txt = "", i;
                    txt = txt + "<h4>Indexes:</h4>";
                    txt = txt + "<table width='100%' xclass='w3-table-all notranslate'><tr>";
                    txt = txt + "<th style='text-align:left;'>Name of Index</th>";  
                    txt = txt + "</tr>";
                    for (i = 0; i < indexnames.length; i++) {
                        txt = txt + "<tr>";       
                        txt = txt + "<td style='text-align:left;'>" + indexnames[i] + "</td>";  
                        txt = txt + "</tr>";       
                    }
                    document.getElementById("yourIX").innerHTML =  txt + "</table>";
                }
                function makeRecordcountsArray(x) {
                    var i, lastTable = false;
                    for (i = 0; i < x.length; i++) {
                        if (i === (x.length - 1)) {lastTable = true; }
                        tx.executeSql("SELECT count(*) AS rc,'" + lastTable + "' AS i FROM [" + x[i] + "]",[],function (tx, results)
                            {
                                var len = results.rows.length, k, cc = "";
                                if (len > 0) {
                                    for (k = 0; k < len; k++) {
                                        recordcounts.push(results.rows.item(k).rc);
                                        cc = results.rows.item(k).i;
                                    }
                                    if (cc === "true") {
                                        w3DBInfo();
                                    }
                                } else {
                                    //window.alert("ERROR 4");
                                }
                            
                            }
                        );
                    }
                }
                function makeViewRecorcountsArray(x) {
                    var i, lastTable = false;
                    for (i = 0; i < x.length; i++) {
                        if (i === (x.length - 1)) {lastTable = true; }
                        tx.executeSql("SELECT count(*) AS rc,'" + lastTable + "' AS i FROM [" + x[i] + "]",[],function (tx, results)
                            {
                                var len = results.rows.length, k, cc = "", txt;
                                if (len > 0) {
                                    for (k = 0; k < len; k++) {
                                        viewrecordcounts.push(results.rows.item(k).rc);
                                        cc = results.rows.item(k).i;
                                    }
                                    if (cc === "true") {
                                        w3DBViewInfo();
                                    }
                                } else {
                                    //window.alert("ERROR 5");
                                }
                            
                            }
                        );
                    }
                }
                tx.executeSql("SELECT tbl_name FROM sqlite_master WHERE type='table' AND tbl_name NOT LIKE '__WebKitDatabaseInfoTable__' AND tbl_name NOT LIKE 'sqlite_sequence'",[],function (tx, results)
                    {
                        var len = results.rows.length, i;
                        if (len > 0) {
                            for (i = 0; i < len; i++) {
                                tblnames.push(results.rows.item(i).tbl_name);
                            }
                            makeRecordcountsArray(tblnames);
                        }
                    }
                );
                tx.executeSql("SELECT tbl_name FROM sqlite_master WHERE type='view'",[],function (tx, results)
                    {
                        var len = results.rows.length, i;
                        if (len > 0) {
                            for (i = 0; i < len; i++) {
                                viewnames.push(results.rows.item(i).tbl_name);
                            }
                            makeViewRecorcountsArray(viewnames);
                        }
                    }
                );
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name NOT LIKE '__WebKitDatabaseInfoTable__'",[],function (tx, results)
                    {
                        var len = results.rows.length, i;
                        if (len > 0) {
                            for (i = 0; i < len; i++) {
                                indexnames.push(results.rows.item(i).name);
                            }
                            w3DBIndexInfo();
                        }
                    }
                );
            }
            ,function (err) {
                //window.alert("ERROR 2.5" + err.message);
            }
        );
    };
    this.w3InitDatabase = function(n) {
        w3DBObj.w3InitCustomers();
        w3DBObj.w3InitCategories();
        w3DBObj.w3InitEmployees();
        w3DBObj.w3InitOrderDetails();    
        w3DBObj.w3InitOrders();        
        w3DBObj.w3InitProducts();            
        w3DBObj.w3InitShippers();                
        w3DBObj.w3InitSuppliers(n);    
    };
    this.w3ClearDatabase = function() {
        var warn = window.confirm("This action will restore the database back to its original content.\n\nAre you sure you want to continue?");
        if (warn === false) {
            return false;
        }
        document.getElementById("divResultSQL").innerHTML =  "";
        if (w3Database) {
            w3Database.transaction(function (tx)
                {
                    tx.executeSql("SELECT name FROM sqlite_master WHERE type='index' AND name<>'sqlite_autoindex___WebKitDatabaseInfoTable___1'",[],function (tx, results)
                        {
                            var len = results.rows.length, i;
                            if (len>0) {
                                for (i = 0; i < len; i++) {
                                    w3DropIndex(results.rows.item(i).name);
                                }
                            }
                        }
                    );
                    tx.executeSql("SELECT name FROM sqlite_master WHERE type='view'",[],function (tx, results)
                        {
                            var len = results.rows.length, i;
                            if (len>0) {
                                for (i = 0; i < len; i++) {
                                    w3DropView(results.rows.item(i).name);
                                }
                            }
                        }
                    );
                    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name<>'sqlite_sequence' AND name<>'__WebKitDatabaseInfoTable__'",[],function (tx, results)
                        {
                            var len = results.rows.length, i;
                            if (len>0) {
                                for (i = 0; i < len; i++) {
                                    w3DropTable(results.rows.item(i).name);
                                    if (i === (len - 1)) { w3DBObj.w3InitDatabase(1); }
                                }
                            } else {
                                w3DBObj.w3InitDatabase(1);
                            }
                        }
                    );
                }
                ,function (err) {
                    //window.alert("Error 2: " + err.message);
                }
            );
        }
    };
    this.w3InitCategories = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Categories (CategoryID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,CategoryName NVARCHAR(255),Description NVARCHAR(255))',[], function(tx)
                    {
                        
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Categories already exists") === -1) {
                    //window.alert("Error 6: " + err.message);
                }
            }
        );
    };
    this.w3InitCustomers = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Customers (CustomerID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,CustomerName NVARCHAR(255),ContactName NVARCHAR(255),Address NVARCHAR(255),City NVARCHAR(255),PostalCode NVARCHAR(255),Country NVARCHAR(255))',[], function(tx)
                    {
                        
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Customers already exists") === -1) {
                    //window.alert("Error 7: " + err.message);
                }
            }
        );
    };
    this.w3InitEmployees = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Employees (EmployeeID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,LastName NVARCHAR(255),FirstName NVARCHAR(255),BirthDate DATE,Photo NVARCHAR(255),Notes MEMO)',[], function(tx)
                    {
                        
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Employees already exists") === -1) {
                    window.alert("Error 8: " + err.message);
                }
            }
        );
    };
    this.w3InitOrderDetails = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE OrderDetails (OrderDetailID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,OrderID INT,ProductID INT,Quantity INT)',[], function(tx)
                    {
                        
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("OrderDetails already exists") === -1) {
                    window.alert("Error 9: " + err.message);
                }
            }
        );
    };
    this.w3InitOrders = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Orders (OrderID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,CustomerID INT,EmployeeID INT,OrderDate DATE,ShipperID INT)',[], function(tx)
                    {
                        
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Orders already exists") === -1) {
                    window.alert("Error 10: " + err.message);
                }
            }
        );
    };
    this.w3InitProducts = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Products (ProductID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,ProductName NVARCHAR(255),SupplierID INT,CategoryID INT,Unit NVARCHAR(255),Price MONEY)',[], function(tx)
                    {
                        
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Products already exists") === -1) {
                    window.alert("Error 11: " + err.message);
                }
            }
        );
    };
    this.w3InitShippers = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Shippers (ShipperID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,ShipperName NVARCHAR(255),Phone NVARCHAR(255))',[], function(tx)
                    {
                        
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Shippers already exists") === -1) {
                    window.alert("Error 12: " + err.message);
                }
            }
        );
    };
    this.w3InitSuppliers = function(n) {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Suppliers (SupplierID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,SupplierName NVARCHAR(255),ContactName NVARCHAR(255),Address NVARCHAR(255),City NVARCHAR(255),PostalCode NVARCHAR(255),Country NVARCHAR(255),Phone NVARCHAR(255))',[], function(tx)
                    {
                        {
                                var sql = document.getElementById("textareaCodeSQL").value;
                                if (n === 0) {
                                    w3DBObj.w3ExecuteSQL(sql);
                                } else {
                                    document.getElementById("divResultSQL").innerHTML = "<div style='margin:10px;'>The database is fully restored.</div>";
                                }
                                w3DBObj.myDatabase();
                            }
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Suppliers already exists") === -1) {
                    //window.alert("Error 13: " + err.message);
                }
            }
        );
    };
    this.runSQL = function(n) {
        w3Database.transaction(function (tx)
            {
                tx.executeSql("SELECT * FROM sqlite_sequence",[],function ()
                    {
                    var sql = document.getElementById("textareaCodeSQL").value;
                    w3DBObj.w3ExecuteSQL(sql);
                    }
                );
            }
            ,function (err) {
                w3DBObj.w3InitDatabase(0);
            }
        );
    };
    
}