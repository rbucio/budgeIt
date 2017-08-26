// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
    };

    var Income = function(id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.amount;
        });
        data.total[type] = sum;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0
    }

    return {
        addItem: function(type, description, amount) {

            var newItem, ID;

            // Initialize ID count
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create item depending on type
            if (type === 'exp') {
                newItem = new Expense(ID, description, amount);
            } else if (type === 'inc'){
                newItem = new Income(ID, description, amount);
            }

            // Finally push item to respective array
            data.allItems[type].push(newItem);
            return newItem;

        },
        deleteItem: function(type, id) {

            var ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },
        calculateBudget: function() {
            // calculate total income and exprenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.total.inc - data.total.exp;

        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp
            }
        },
        test: function() {
            console.log(data);
        }
    };

})();


// UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: '#type',
        inputDescription: '#description',
        inputAmount: '#amount',
        inputButton: '#add-button',
        incomeContainer: '#income-list',
        expensesContainer: '#expenses-list',
        budgetLabel: '#total-budget',
        incomeLabel: '#income',
        expensesLabel: '#expenses',
        monthLabel: '#month',
        yearLabel: '#year',
        container: '#display-list-container'
    }

    var formatNumber = function(num, type) {

        var numSplit, int, dec;

        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> + 2,310.46
        */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int= numSplit[0];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        type === 'exp' ? sign = '-' : sign = '+';

        return sign + ' ' + int + '.' + dec;

    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                amount: parseFloat(document.querySelector(DOMstrings.inputAmount).value)
            }
        },
        addListItem: function(obj, type) {

            var html, newHTML, container;

            // Create HTML string with placeholder text
            if ( type === 'inc') {

                container = DOMstrings.incomeContainer;

                html ='<div class="list-item group" id="inc-%id%"><p class="list-item-description">%description%</p><p class="list-item-amount income-color">%amount% <span><i class="ion-trash-a icon"></i></span></p></div>'

            } else if ( type === 'exp') {

                container = DOMstrings.expensesContainer;

                html = '<div class="list-item group" id="exp-%id%"><p class="list-item-description">%description%</p><p class="list-item-amount expenses-color">%amount% <span><i class="ion-trash-a icon"></i></span></p></div>'

            }

            // Replace the placeholder text with the actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%amount%', formatNumber(obj.amount, type));

            // Insert the HTML into the DOM
            document.querySelector(container).insertAdjacentHTML('beforeend', newHTML);

        },
        deleteListItem: function(selectorId) {

            var element = document.getElementById(selectorId);
            element.parentNode.removeChild(element);

        },
        clearFields: function() {

            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputAmount);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();

        },
        displayBudget: function(obj) {

            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.budget, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.budget, 'exp');
        },
        displayDate: function() {
            var now, months, month, year;
            now = new Date();

            year = now.getFullYear();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

            month = now.getMonth();

            document.querySelector(DOMstrings.monthLabel).textContent = months[month];
            document.querySelector(DOMstrings.yearLabel).textContent = year;
        },
        getDOMstrings: function() {

            return DOMstrings;

        }
    }

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        window.addEventListener('keypress', function(e) {

            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }

        });

    };

    var updateBudget = function() {

        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        var budget = budgetCtrl.getBudget();

        //3.Display the budget on UI
        UICtrl.displayBudget(budget);

    }

    var ctrlAddItem = function() {

        var input, newItem;

        //1. Get input data
        input = UICtrl.getInput();

        // Check for empty fields
        if (input.description !== "" && !isNaN(input.amount) && input.amount > 0) {

            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.amount);

            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear fields
            UICtrl.clearFields();

            //5. Calculate and update budget
            updateBudget();

        }
    };

    var ctrlDeleteItem = function(e) {

        var itemId, splitId, type, id;

        // traverse to parent element where id is at
        itemId = e.target.parentNode.parentNode.parentNode.id;

        if(itemId) {

            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            console.log(type, id);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, id);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemId);

            // 3. Update and show the new budget
            updateBudget();
        }

    };

    return {
        init: function() {
            setUpEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0
            });
            UICtrl.displayDate();
        }
    };

})( budgetController, UIController);

controller.init();
