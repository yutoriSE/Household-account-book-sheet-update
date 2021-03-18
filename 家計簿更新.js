function doPost(e) {
    //console.log(e)
  
    //JSONにパースする
    var json = JSON.parse(e.postData.contents);
    
    //送られたLINEメッセージを取得
    var message = json.events[0].message.text;
  
    //user名取得
    var user = json.events[0].source.userId
  
    //メッセージの配列化
  　var array = message.split(/\n/);
  
  
    //返信設定
    var url = "https://api.line.me/v2/bot/message/reply";
  
    var headers = {
      "Content-Type" : "application/json; charset=UTF-8",
      "Authorization": "Bearer ******************************",
    };
  
    /*
     チェックエラーならエラーメッセージをラインにポストする
    */
  
    //項目数チェック
    if ( array.length != 2 ) {
  
      var reply = {
        "replyToken" : json.events[0].replyToken,
          "messages" : [
            {
              'type':'text',
              'text':"項目数が誤っています"
            }
          ]
      };
      
      var options = {
        "method" : "post",
        "headers" : headers,
        "payload" : JSON.stringify(reply)
      };
      
      return UrlFetchApp.fetch(url, options);
    } 
  
  
    //数値チェック
    try {
      if (!Number.isInteger(Number(array[1])) || !Number(array[1]) > 0 ) {
        var reply = {
        "replyToken" : json.events[0].replyToken,
          "messages" : [
            {
              'type':'text',
              'text':"金額は1以上の整数で入力して下さい"
            }
          ]
        };
      
        var options = {
          "method" : "post",
          "headers" : headers,
          "payload" : JSON.stringify(reply)
        };
        
        return UrlFetchApp.fetch(url, options);
      }
    }catch(e){
      if (!Number.isInteger(Number(array[1])) || !Number(array[1]) > 0 ) {
        var reply = {
        "replyToken" : json.events[0].replyToken,
          "messages" : [
            {
              'type':'text',
              'text':"金額は1以上の整数で入力して下さい"
            }
          ]
        };
  
        var options = {
          "method" : "post",
          "headers" : headers,
          "payload" : JSON.stringify(reply)
        };
        
        return UrlFetchApp.fetch(url, options);
      }
    }
  
    /*
     チェック完了
    */
  
    //日付取得しシート名の取得
    var date = new Date();
    var sendDate = Utilities.formatDate(date, 'Asia/Tokyo', 'M/dd');
    var sheetName = String(Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/M'));
  
    //エラーがない場合は登録情報の設定
    var spreadsheet = SpreadsheetApp.openById('***********************');
    var sheet = spreadsheet.getSheetByName(sheetName);
    var lastRow = sheet.getRange(3, 3).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
    var userId = json.events[0]['source']['userId'];
  
    var user = '';
    if (userId =='***************') {
      user = '*********';
    }
    if (userId == '**************') {
      user = '*********';
    }
  
    //2月用のセル指定
    if ( Utilities.formatDate(date, 'Asia/Tokyo', 'M') == 2 ){
  
      sheet.getRange(lastRow+1, 3).setValue(array[0]);
      sheet.getRange(lastRow+1, 4).setValue(array[1]);
      sheet.getRange(lastRow+1, 5).setValue(user);
  
    }　else {
  
      sheet.getRange(lastRow+1, 3).setValue(sendDate);
      sheet.getRange(lastRow+1, 4).setValue(array[0]);
      sheet.getRange(lastRow+1, 5).setValue(array[1]);
      sheet.getRange(lastRow+1, 6).setValue(user);
    }
  
    //登録完了メッセージの返信
    var text = '日付：'+String(sendDate)+'\n用途：'+String(array[0])+'\n金額：'+String(array[1])+'\n入力者：'+user+'\n\n上記内容で登録しました。'
    var text = '日付：'+String(sendDate)+'\n用途：'+String(array[0])+'\n金額：'+String(array[1])+'\n\n上記内容で登録しました。'
    var reply = {
      "replyToken" : json.events[0].replyToken,
          "messages" : [
            {
              'type':'text',
              'text':text
            }
          ]
    };
    var options = {
        "method" : "post",
        "headers" : headers,
        "payload" : JSON.stringify(reply)
    };
  
    UrlFetchApp.fetch(url, options);
  
    return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  
  }
  
  
  