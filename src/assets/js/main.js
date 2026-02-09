import { initAll } from './govuk-frontend.min.js';

initAll();

var stateful = new window.Stateful();

var scenarios = {
    "register": {
        "user-name": "Sarah Philips",
        "user-phone": "07700 900457",
        "user-email": "sarah.phillips@example.com",
        "business-name": "Café Candide",
        "business-id": "90636040",
        "business-type": "56102 Unlicensed restaurants and cafes",
        "business-address-line-1": "483 Green Lanes",
        "business-address-line-2": "", 
        "business-address-town": "London",
        "business-address-county": "",
        "business-postcode": "N13 4BS",
        "business-employees": "6",
        "collection-address-line-1": "72 Guild Street",
        "collection-address-line-2": "", 
        "collection-address-town": "London",
        "collection-address-county": "",
        "collection-postcode": "SE23 6FH",
        "directions-text": "Alleyway beside car park",
        "waste-type": "Dry mixed recycling",
        "container-type": "1100 litres",
        "container-count": "1",
        "container-owned": "yes",
        "first-collection-date-day": "7",
        "first-collection-date-month": "4",
        "first-collection-date-year": "2026",
        "start-date-day": "1",
        "start-date-month": "4",
        "start-date-year": "2026",
        "collection-frequency": "2",
        "collection-period": "weeks",
        "collection-day": "Tuesday"
    },
    "review-quote": {
        "signed-in": true,
        "has-agreement-for-review": true
    },
    "established": {
        "signed-in": true,
        "has-agreements": true
    },
    "failed-collection": {
        "signed-in": true,
        "has-agreements": true,
        "has-failed-collection": true
    },
    "staff": {
        "is-staff": true,
        "signed-in": true
    },
};

$('[data-start-scenario]').on('click', function(e){
    e.preventDefault();
    var url = $(this).attr('href');
    var scenario = $(this).attr('data-start-scenario');
    stateful.clearState();
    $.each(scenarios[scenario], function(key, val){
        stateful.updateState(key, val);
    });
    stateful.applyState();
    window.location.href = url;
});

$('.js-clear-scenario').on('click', function(e){
    e.preventDefault();
    stateful.clearState();
    window.location.reload();
});

$('.js-scenario-data').each(function(){
    var state = stateful.getState();
    var keys = Object.keys(state).sort();
    var $tableBody = $('.govuk-table__body', this);

    $tableBody.html('');
    $.each(keys, function(i, key){
        console.log(key, state[key]);
        $tableBody.append(
            '<tr class="govuk-table__row">' + 
            '<td class="govuk-table__cell">' + key + '</td>' + 
            '<td class="govuk-table__cell">' + state[key] + '</td>' + 
            '</tr>'
        );
    });
});

var dateFormat = function dateFormat(y, m, d) {
    function ordinal(d){
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:  return 'st';
            case 2:  return 'nd';
            case 3:  return 'rd';
            default: return 'th';
        }
    }

    function month(m) {
        return [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ][m-1];
    }

    return '' + d + ordinal(d) + ' ' + month(m) + ' ' + y;
}

$.each(['start-date', 'first-collection-date'], function(i, id){
    $('.js-' + id).each(function(){
        var y = stateful.getState(id + '-year');
        var m = stateful.getState(id + '-month');
        var d = stateful.getState(id + '-day');
        if (y && m && d) {
            $(this).text(dateFormat(y, m, d));
        }
    });
});

$('#frequency').on('change', function(){
    var frequency = 0 + $(this).val();
    if (frequency == 1) {
        $('#period option[value="weeks"]').val("week").text("week");
        $('#period option[value="months"]').val("month").text("month");
    } else {
        $('#period option[value="week"]').val("weeks").text("weeks");
        $('#period option[value="month"]').val("months").text("months");
    }
    $('#period').trigger('change');
});

$('.govuk-date-input.st8ify').each(function(){
    $('input', this).each(function(){
        var key = $(this).attr('id');
        var state = stateful.getState(key);
        $(this).val(state);
        $(this).on('change', function(){
            stateful.updateState(key, $(this).val());
        });
    });
});

if (stateful.getState('signed-in')) {
    $('.js-signed-in-navigation').removeClass('hidden');
}

$('.js-agreement-reviewed').on('click', function(){
    stateful.updateState('has-agreement-for-review');
});
