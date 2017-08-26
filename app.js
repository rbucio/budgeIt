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
        yearLabel: '#year'
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

                html ='<div class="list-item group" id="income-%id%"><p class="list-item-description">%description%</p><p class="list-item-amount income-color">%amount% <span><i class="ion-trash-a icon"></i></span></p></div>'

            } else if ( type === 'exp') {

                container = DOMstrings.expensesContainer;

                html = '<div class="list-item group" id="expense-%id%"><p class="list-item-description">%description%</p><p class="list-item-amount expenses-color">%amount% <span><i class="ion-trash-a icon"></i></span></p></div>'

            }

            // Replace the placeholder text with the actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%amount%', obj.amount);

            // Insert the HTML into the DOM
            document.querySelector(container).insertAdjacentHTML('beforeend', newHTML);

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
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        },
        displayMonth: function() {
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

        //6. Display the budget on the UI
        console.log(input);
    };

    return {
        init: function() {
            setUpEventListeners();
            UICtrl.displayMonth();
        }
    };

})( budgetController, UIController);

controller.init();
