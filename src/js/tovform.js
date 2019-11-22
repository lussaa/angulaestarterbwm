$(function () {
  $("#load_history").click(function () {
      loadAvailableTOVData(0);
    }
  );
});

$(function () {

  function createNewTOVDataset() {

    var need_alert = false
    var err_msg = "";
    carf_filter = "";
    custom_filters = "";

    if ($('#host').val() == '') {
      host = 'ALL'
    } else {
      host = $('#host').val();
    }
    console.log('Host=' + host);

    if ($('#carf').val() != '') {
      carf_filter = $('#carf').val();
    }
    console.log('carf=' + carf);

    if ($('#date_from').val() == '') {
      err_msg += 'Please set a valid From Date\n';
      need_alert = true;
    }
    if ($('#date_to').val() == '') {
      err_msg += 'Please set a valid To Date\n';
      need_alert = true;
    }
    if (need_alert) {
      alert(err_msg);
    } else {

      dateFrom = getDate($('#date_from').val(), $('#hour_from').val(), $('#minute_from').val(), $('#second_from').val());
      console.log("DATE FROM:\n" + dateFrom.toUTCString());


      dateTo = getDate($('#date_to').val(), $('#hour_to').val(), $('#minute_to').val(), $('#second_to').val());
      console.log("DATE TO:\n" + dateTo.toUTCString());

      pFrom = getYYYYMMDDHH(dateFrom);
      pTo = getYYYYMMDDHH(dateTo);

      console.log('PartitionFrom:' + pFrom);
      console.log('PartitionTo:' + pTo);

      tsFrom = toUnixTS(dateFrom);
      tsTo = toUnixTS(dateTo);

      console.log('TSFrom:' + tsFrom);
      console.log('TSTo:' + tsTo);

      dataLevel = $('#data_lvl').val();
      description = $('#tov_description').val();
      category = $('#tov_category').val();




      console.log("dataLvl: " + dataLevel);
      console.log("description: " + description);
      console.log("category: " + category);




      switch (dataLevel) {
        case "PRD":
          var tableName = PRD_TOV_TABLE_NAME;
          break;
        case "STG":
          var tableName = STG_TOV_TABLE_NAME;
          break;
        case "QAL":
          var tableName = QAL_TOV_TABLE_NAME;
          break;
      }



      var rules = [];

      if (host == 'ALL') {
        var query = "select * from " + tableName + " where yyyymmddhh between " + pFrom + " and " + pTo + " and famuuid_txn_start_ts between " + tsFrom + " and " + tsTo + "";
      } else {
        var query = "select * from " + tableName + " where yyyymmddhh between " + pFrom + " and " + pTo + " and famuuid_txn_start_ts between " + tsFrom + " and " + tsTo + "" + " and mdwtxn_ocomhostname in ('" + host.replace(/,/g, "','") + "')";
      }

      custom_filters += $('#custom_filters_box li .filter_item').map(function () {
        return $(this).text();
      }).get().join(' AND ');

      custom_filters_descr = "";

      if (custom_filters != "") {
        query = query + " AND " + custom_filters;
        custom_filters_descr = "<br><b>Custom Filters:</b> " + custom_filters;
      }

      if (carf_filter != "") {
        query = query + " AND mdwedibl_carf like '" + carf_filter + "'";
      }

      //build json description

      var description = {
        html_description: "<b>" + description + "</b> | Host=" + host + "<br><b>From</b>+ " + dateFrom.toUTCString() + "<br><b>To</b> " + dateTo.toUTCString() + custom_filters_descr,
        host: host,
        date_from: dateFrom.toUTCString(),
        date_to: dateTo.toUTCString(),
        custom_filters_descr: custom_filters_descr,
        category: category
      }

      console.log("New Dataset Query: " + query);
      //Submit job using rest api
      var newJob = {
        name: "TOVJob",
        category: "TOV",
        status: "Pending",
        dbTimeMs: -1,
        totalTimeMs: -1,
        description: JSON.stringify(description),
        query: query,
        dataSourceName: "stats_raw_data_hadoop",
        dataSourceType: "hive",
        dataLevel: dataLevel,
        requesterEmail: "sandro-aldo.aramini@amadeus.com;erabbia@amadeus.com",
        comments: "TOVjob"
      };

      console.log("REST API | PUT JOB:\n" + JSON.stringify(newJob));

      startTime = new Date();
      $.ajax({

        url: SABE_BASE_URL + '/Jobs',
        type: 'PUT',
        data: JSON.stringify(newJob),

        headers: {
          accept: 'application/json'
        },
        contentType: 'application/json',
        async: true,
        success: function (data) {
          console.log(data);
          var endTime = new Date();

          dialog.dialog("close");
          location.reload();

          componentHandler.upgradeDom();

        }
      });
    }
  }

  dialog = $("#new_tov_form").dialog({
    autoOpen: false,
    height: 600,
    width: 600,
    modal: true,
    buttons: {
      "Create": createNewTOVDataset,
      Cancel: function () {
        dialog.dialog("close");
      }
    },
    close: function () {
      form[0].reset();
      //allFields.removeClass( "ui-state-error" );
    }
  });

  form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    createNewTOVDataset();
  });

  $("#new_tov_data_button").button().on("click", function () {
    dialog.dialog("open");
  });

  $('#date_to').datepicker({
    dateFormat: 'yy/mm/dd',
    showOn: "button",
    buttonImage: "images/ic_date_range_black_24dp_1x.png",
    buttonImageOnly: true,
    buttonText: "Select date"
  });
  $('#date_from').datepicker({
    dateFormat: 'yy/mm/dd',
    showOn: "button",
    buttonImage: "images/ic_date_range_black_24dp_1x.png",
    buttonImageOnly: true,
    buttonText: "Select date"
  });

  $('#date_from').datepicker({
    dateFormat: 'yy/mm/dd',
    showOn: "button",
    buttonImage: "images/ic_date_range_black_24dp_1x.png",
    buttonImageOnly: true,
    buttonText: "Select date"
  });
  $('#date_to').datepicker({
    dateFormat: 'yy/mm/dd',
    showOn: "button",
    buttonImage: "images/ic_date_range_black_24dp_1x.png",
    buttonImageOnly: true,
    buttonText: "Select date"
  });

  $(document.body).on('click', '.set_prime_button', function () {
    var id = $(this).closest("tr")
      .find(".data_id_td")
      .text();
    var env = $(this).closest("tr")
      .find(".data_level_td")
      .text();
    $('#prime_id').val(id);
    $('#prime_env').val(env);
    console.log('prime_id(hiddenform):' + $(':hidden#prime_id').val());
    $('#current_prime').val(build_desc_str($(this))).parent('.mdl-textfield').addClass('is-dirty').removeClass('is-invalid');
  });

  $(document.body).on('click', '.set_second_button', function () {
    var id = $(this).closest("tr")
      .find(".data_id_td")
      .text();
    var env = $(this).closest("tr")
      .find(".data_level_td")
      .text();
    $('#second_id').val(id);
    $('#second_env').val(env);
    console.log('second_id(hiddenform):' + $(':hidden#second_id').val());
    $('#current_second').val(build_desc_str($(this))).parent('.mdl-textfield').addClass('is-dirty').removeClass('is-invalid');
  });

  $(document.body).on('click', '.delete_dataset', function () {
    var id = $(this).closest("tr")
      .find(".data_id_td")
      .text();

    console.log('deleting dataset with id=' + id);
    var r = confirm('Deleting dataset with id=' + id);
    if (r == true) {
      $.ajax({
        url: SABE_BASE_URL + '/Jobs/' + id + '/status?newStatus=Cancelled',
        type: 'PUT',
        success: function (data) {
          //alert('Dataset '+ id + ' deleted!');
          location.reload();

        }
      });
    }
  });


  $("#data_lvl").change(function () {


    var data_lvl = $('#data_lvl').val();
    var table_name = "prd_raw_stat_satellite";

    console.log("DataLevel selected: " + data_lvl);

    if (data_lvl == "PRD") {
      table_name = PRD_TOV_TABLE_NAME;
    }
    if (data_lvl == "STG") {
      table_name = STG_TOV_TABLE_NAME;
    }
    if (data_lvl == "QAL") {
      table_name = QAL_TOV_TABLE_NAME;
    }

    fillCustomFilters(table_name, '#column_names', '#form_loading');
  });

  $('#execute_tov_button').button().click(function (event) {
    var p_id = $('#prime_id').val();
    var s_id = $('#second_id').val();

    var p_env = $('#prime_env').val();
    var s_env = $('#second_env').val();

    var need_alert = false
    var err_msg = "";

    if (p_id == '') {
      err_msg += 'Please set a valid Prime\n';
      need_alert = true;
    }
    if (s_id == '') {
      err_msg += 'Please set a valid Second\n';
      need_alert = true;
    }
    if (need_alert) {
      alert(err_msg);
    } else {
      //var confirm_text =  confirm('TOV between :\n[I=' +  $('#prime_id').val() + '] and [II=' + $('#second_id').val()+"]\n\nProceed?");
      //if(confirm_text){
      window.location.href = '/tovboard/tov.html?p=' + p_id + '&s=' + s_id + '&env1=' + p_env + '&env2=' + s_env;
      //}
    }

  });

  $('#display_dataset_button').button().click(function (event) {
    var p_id = $('#prime_id').val();


    var p_env = $('#prime_env').val();

    console.log(p_id + " - " + p_env);

    var need_alert = false
    var err_msg = "";

    if (p_id == '') {
      err_msg += 'Please set a valid Prime\n';
      need_alert = true;
    }

    if (need_alert) {
      alert(err_msg);
    } else {
      //var confirm_text =  confirm('TOV between :\n[I=' +  $('#prime_id').val() + '] and [II=' + $('#second_id').val()+"]\n\nProceed?");
      //if(confirm_text){
      window.location.href = '/tovboard/display_dataset.html?p=' + p_id + '&env1=' + p_env;
      //}
    }

  });


  $('#add_custom_filter').click(function (event) {
    var expr = $('#column_names').val() + " " + $('#custom_filter_operation').val() + " " + $('#column_custom_value').val();
    $('#custom_filters_box ul').append('<li><span class="filter_item"> ' + expr + '</span> <button class="custom_filter_li">x</button></li>');
  });


  //Remove custom filters
  $('#custom_filters_box').on("click", "button", function () {
    $(this).parent().remove();
  });

});


/* Load TOV Dataset */
function loadAvailableTOVData(lastWeekFlag) {

  $("#tovtable tbody").empty();

  var startTime = new Date();
  console.log('[GET PRD Jobs]  ... Ajax request on going\n' + SABE_BASE_URL + '/Jobs?dataLevel=PRD&tov=1&debug=1' + '&lastweekonly=' + lastWeekFlag);


  $.ajax({
    url: SABE_BASE_URL + '/Jobs?dataLevel=PRD&tov=1&debug=1' + '&lastweekonly=' + lastWeekFlag,
    type: 'GET',
    headers: {
      accept: 'application/json'
    },
    contentType: 'application/json',
    async: true,
    success: function (data) {


      $("#tovtable tbody").html('');

      if (data == null) {
        alert('No PRD Datasets!');
      } else {

        dataset = data;

        var endTime = new Date();


        for (i = 0; i < dataset.length; i++) {

          //just in case
          if (dataset[i]['category'] != 'TOV') {
            continue;
          }

          if (dataset[i]['status'] == 'Done') {
            statusColumn = '<td><button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">' +
              ' <i class="material-icons">done</i>' +
              '</button></td> ';
          }
          if (dataset[i]['status'] == 'Pending') {
            statusColumn = '<td><button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">' +
              ' <i class="material-icons">query_builder</i>' +
              '</button></td> ';
          }

          // Show job only if status=Pending or Done (Ready)

          if (dataset[i]['status'] == 'Pending' || dataset[i]['status'] == 'Done') {

            var jdesc = {};
            try {
              var jdesc = JSON.parse(dataset[i]['description']);
            }
            catch (e) {
              var jdesc = {html_description: dataset[i]['description']};
            }

            $("#tovtable tbody").append('<tr> ' +
              '<td class="data_id_td"><b>' + dataset[i]['id'] + '</b></td>' +
              '<td class="data_level_td">' + dataset[i]['dataLevel'] + '</td>' +
              '<td class="submit_date_td"><b>' + moment.unix(parseInt(dataset[i]['submitTimestamp'])).format(DATASET_TABLE_DATE_FORMAT) + '</b></td>' +


              '<td class="category_td">' + jdesc['category'] + '</td>' +
              '<td class="description_td">' + jdesc['html_description'] + '</td>' +


              '<td>' +
              '<button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored set_prime_button">' +
              ' <i class="material-icons">filter_1</i>' +
              '</button>			' +
              '<button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored set_second_button">' +
              ' <i class="material-icons">filter_2</i>' +
              '</button></td>' + statusColumn +
              '<td>' +
              '<button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored delete_dataset">' +
              ' <i class="material-icons">delete_forever</i>' +
              '</button></td></tr>');
          }
          var timeDiff = endTime - startTime;
          console.log('[GET PRD Jobs]  ... Done!');
          componentHandler.upgradeDom();
          createTableFilter();
        }

      }

      console.log('[GET STG Jobs]  ... Ajax request on going\n' + SABE_BASE_URL + '/Jobs?dataLevel=STG&tov=1&debug=1' + '&lastweekonly=' + lastWeekFlag);
      $.ajax({
        url: SABE_BASE_URL + '/Jobs?dataLevel=STG&tov=1&debug=1' + '&lastweekonly=' + lastWeekFlag,
        type: 'GET',
        headers: {
          accept: 'application/json'
        },
        contentType: 'application/json',
        async: true,
        success: function (data) {

          if (data != null) {


            dataset = data;


            var endTime = new Date();


            for (i = 0; i < dataset.length; i++) {

              if (dataset[i]['category'] != 'TOV') {
                continue;
              }

              if (dataset[i]['status'] == 'Done') {
                statusColumn = '<td><button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">' +
                  ' <i class="material-icons">done</i>' +
                  '</button></td> ';
              }
              if (dataset[i]['status'] == 'Pending') {
                statusColumn = '<td><button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">' +
                  ' <i class="material-icons">query_builder</i>' +
                  '</button></td> ';
              }

              // Show job only if status=Pending or Done (Ready)

              if (dataset[i]['status'] == 'Pending' || dataset[i]['status'] == 'Done') {

                var jdesc = {};
                try {
                  var jdesc = JSON.parse(dataset[i]['description']);
                }
                catch (e) {
                  var jdesc = {html_description: dataset[i]['description']};
                }


                $("#tovtable tbody").append('<tr class="stg_row"> ' +
                  '<td class="data_id_td"><b>' + dataset[i]['id'] + '</b></td>' +
                  '<td class="data_level_td">' + dataset[i]['dataLevel'] + '</td>' +
                  '<td class="submit_date_td"><b>' + moment.unix(parseInt(dataset[i]['submitTimestamp'])).format(DATASET_TABLE_DATE_FORMAT) + '</b></td>' +
                  '<td class="category_td">' + jdesc['category'] + '</td>' +
                  '<td class="description_td">' + jdesc['html_description'] + '</td>' +
                  '<td>' +
                  '<button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored set_prime_button">' +
                  ' <i class="material-icons">filter_1</i>' +
                  '</button>			' +
                  '<button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored set_second_button">' +
                  ' <i class="material-icons">filter_2</i>' +
                  '</button></td>' + statusColumn +
                  '<td>' +
                  '<button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored delete_dataset">' +
                  ' <i class="material-icons">delete_forever</i>' +
                  '</button></td></tr>');
              }
              var timeDiff = endTime - startTime;
              componentHandler.upgradeDom();
              createTableFilter();

            }

            if (LOAD_QAL_JOBS) {

              console.log('[GET QAL Jobs]  ... Ajax request on going');
              $.ajax({
                url: SABE_BASE_URL + '/Jobs?dataLevel=QAL&tov=1&debug=1' + '&lastweekonly=' + lastWeekFlag,
                type: 'GET',
                headers: {
                  accept: 'application/json'
                },
                contentType: 'application/json',
                async: true,
                success: function (data) {

                  if (data != null) {
                    dataset = data;

                    var endTime = new Date();


                    for (i = 0; i < dataset.length; i++) {

                      if (dataset[i]['category'] != 'TOV') {
                        continue;
                      }

                      if (dataset[i]['status'] == 'Done') {
                        statusColumn = '<td><button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">' +
                          ' <i class="material-icons">done</i>' +
                          '</button></td> ';
                      }
                      if (dataset[i]['status'] == 'Pending') {
                        statusColumn = '<td><button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">' +
                          ' <i class="material-icons">query_builder</i>' +
                          '</button></td> ';
                      }

                      // Show job only if status=Pending or Done (Ready)

                      if (dataset[i]['status'] == 'Pending' || dataset[i]['status'] == 'Done') {
                        var jdesc = {};
                        try {
                          var jdesc = JSON.parse(dataset[i]['description']);
                        }
                        catch (e) {
                          var jdesc = {html_description: dataset[i]['description']};
                        }


                        $("#tovtable tbody").append('<tr class="qal_row"> ' +
                          '<td class="data_id_td"><b>' + dataset[i]['id'] + '</b></td>' +
                          '<td class="data_level_td">' + dataset[i]['dataLevel'] + '</td>' +
                          '<td class="submit_date_td"><b>' + moment.unix(parseInt(dataset[i]['submitTimestamp'])).format(DATASET_TABLE_DATE_FORMAT) + '</b></td>' +
                          '<td class="category_td">' + jdesc['category'] + '</td>' +
                          '<td class="description_td">' + jdesc['html_description'] + '</td>' +
                          '<td>' +
                          '<button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored set_prime_button">' +
                          ' <i class="material-icons">filter_1</i>' +
                          '</button>			' +
                          '<button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored set_second_button">' +
                          ' <i class="material-icons">filter_2</i>' +
                          '</button></td>' + statusColumn +
                          '<td>' +
                          '<button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored delete_dataset">' +
                          ' <i class="material-icons">delete_forever</i>' +
                          '</button></td></tr>');

                      }
                      var timeDiff = endTime - startTime;

                      componentHandler.upgradeDom();

                    }
                  }
                  console.log('[GET QAL Jobs]  ... Done!');
                  componentHandler.upgradeDom();
                  createTableFilter();
                }

              });

            }
          }
        }
      });
    }
  });


  //load fields into the new dataset form
  fillCustomFilters(DEFAULT_TOV_TABLE_NAME, '#column_names', '#form_loading');


}

function createTableFilter() {
  var options = {
    valueNames: ['data_id_td', 'data_level_td', 'date', 'category_td', 'description_td', 'col5', 'col6', 'col7']
  };
  var userList = new List('available_data_block', options);
}

/*Form Validation*/
function check_form_fields(ocomhost, df, dt) {
  var err_msg = 'Wrong Form Data!';
  var need_alert = false
  if (ocomhost == '') {
    need_alert = true;
    err_msg += '\nPlease provide a valid ocomhost';
  }
  if (df == '') {
    need_alert = true;
    err_msg += '\nPlease provide a start date yyyy/mm/dd';
  }
  if (dt == '') {
    need_alert = true;
    err_msg += '\nPlease provide an end date yyyy/mm/dd';
  }
  if (need_alert) {
    alert(err_msg);
    return false;
  } else {
    return true;
  }
}

/* Prime-Second textual description*/
function build_desc_str(button_clicked_ref) {
  var id = $(button_clicked_ref).closest("tr")
    .find(".data_id_td")
    .text();

  var ocomhost = $(button_clicked_ref).closest("tr")
    .find(".ocomhost_td")
    .text();
  var date_from = $(button_clicked_ref).closest("tr")
    .find(".date_from_td")
    .text();

  var date_to = $(button_clicked_ref).closest("tr")
    .find(".date_to_td")
    .text();

  return "| DATASET #" + id + " |";
}

