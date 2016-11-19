var db = require('../db');

function buildSelectQuery(table, req){
  var attributes = req.params["attributes"].split('-');
  
  if("conditions" in req.params){
    var conditions = req.params["conditions"].split('-');
    var operators = req.params["operators"].split('-');
    var boundaries = req.params["boundaries"].split('-');
   
    if(conditions.length!=operators.length || conditions.length!=boundaries.length) return "error";
  }

  if("logic" in req.params){
    var logic = req.params["logic"].split('-'); 
  }

  var sqlQuery = "SELECT ";
	
  for (var i=0; i<attributes.length;i++){
    if (i==attributes.length-1){
      sqlQuery+=attributes[i]+" FROM "+table+" WHERE ";
    }else{
      sqlQuery+=attributes[i]+",";
    }
  }

  
  for (var i=0; i<conditions.length;i++){
    if(operators[i]=="eq"){
      operators[i]="=";  
    }else if(operators[i]=="lt"){
      operators[i]="<";
    }else if(operators[i]=="lte"){
      operators[i]="<=";
    }else if(operators[i]=="gt"){
      operators[i]=">";
    }else if(operators[i]=="gte"){
      operators[i]=">=";
    }else{
      return "error";
    }

    if(i==conditions.length-1){
      sqlQuery+=conditions[i]+operators[i]+"'"+boundaries[i].replace("%20", " ")+"'"+";";
    }else{
      sqlQuery+=conditions[i]+operators[i]+"'"+boundaries[i].replace("%20", " ")+"'"+" "+logic[i]+" ";
    }
  }

  return sqlQuery;

}

function querySelectAndRoute(table, req, res, next){
 var query = buildSelectQuery(table, req);
  if (query!="error"){
    db.query(query, 
      function(err){
        res.render('error', {message: err.message, error:err});
      },
      function(result){
        res.render('results', {results:result});
      });    
  }else{
    res.render('error', {error:"bad url"});
  }
}

module.exports.buildSelectQuery = buildSelectQuery;
module.exports.querySelectAndRoute = querySelectAndRoute;
