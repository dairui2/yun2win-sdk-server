var db=require("../plugins/db");
var utils=require("../utils");

var Obj=db.define("Conversation",{
    clientId:db.String,
    type:db.String,
    targetId:db.String,
    isDelete:db.Boolean
});

Obj.get=function(id,cb){
    this.find({where:{id:id}}).then(function(obj){
        var result=obj;
        if(obj)
            result=db.checkId(obj.dataValues);
        if(cb)
            cb(null,result);
    });
};

Obj.getConversationList=function(clientId,clientTime,filter_term,limit,offset,cb){
    var that=this;
    var where={clientId:clientId, updatedAt:{$gt:clientTime }};
    if(filter_term)
        where.$or=[{type:filter_term}];

    that.findAll({
        where:where,
        attributes: [[db.fn('COUNT', db.col('id')), 'count']]
    })
        .then(function(obj){
            var maxCount=0;
            if(obj.length>0)
                maxCount=obj[0].dataValues.count;

            that.findAll({
                where:where,
                limit:limit,
                offset:offset,
                order:'updatedAt'
            }).then(function(obj){
                var result=[];
                if(obj)
                    for(var i=0;i<obj.length;i++)
                        result.push(db.checkId(obj[i].dataValues));
                if(cb)
                    cb(null,{total_count:maxCount,entries:result});
            });
        });
};

Obj.getConversation=function(clientId,clientTime,id,cb){
    this.find({where:{clientId:clientId,id:id,updatedAt:{$gte:clientTime }}}).then(function(obj){
        var result=obj;
        if(obj)
            result=db.checkId(obj.dataValues);
        if(cb)
            cb(null,result);
    });
};


module.exports=Obj;