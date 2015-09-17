// v1.4
(function ($) {

    //整體使用
    $.vmodel = {};

    //內部全域的物件。也就是控制外部的  $(selector).vmodel(的匿名含式/物件)
    var local = null;

    // 實體化的存放倉儲，提供內部呼叫。
    var storage = {}; 

    
    // 內部全域的輔助方法
    $.vmodel.api = new function (){

        // 物件排序
        this.obj_sort = function (obj){
            var temp = [];
            var i = 0;
            
            $.each(obj, function(key, val) {
                temp[i++] = key;
            });
            
            temp.sort();

            var data = {};
            $.each(temp, function (key, val){
                data[val] = obj[val]
            });

            return data;
        }

        /**
         * 批次呼叫可自動掛載的 function
         * @param   autoload_method_ary     需要觸發的 function 名稱
         * @param   object                  也就是外部的實體化後的 $(selector).vmodel("匿名方法")
         */
        this.each_autoload = function (autoload_method_ary, obj){
            $.each(autoload_method_ary, function(key, name) {

                if ($.type(obj[name]) != "function") {
                    local.msg_error(name, "不存在。");
                }

                obj[name]();
            });
        },

        /**
         * 若使用者有設定 autoload() 就會自動呼叫
         * @param object 也就是外部的實體化後的 $(selector).vmodel("匿名方法")
         */
        this.is_trigger_autocall = function (obj){
            if (obj.autoload) {

                var type = $.type(obj.autoload);

                if (type == "function") {
                    var result = obj.autoload();

                    // 如果 function 沒有回傳陣列，就不繼續
                    // 這情形會發生在已經由 autoload() 寫好要觸發的程序，所以不需要回傳陣列
                    if ($.type(result) == "array") {
                        ary = result;
                    }
                    else {
                        return false;
                    }
                }
                else if (type == "array") {
                    var ary = obj.autoload;
                }
                else {
                    local.msg_error("autoload", "格式錯誤，型態只能是 function 或 array。")
                }

                $.vmodel.api.each_autoload(ary, obj);
            }
        }

    }


    /**
     * 取得倉儲
     * @param   string name    (選) 倉儲的存放名稱。當為空時，返回所有倉儲
     * @param   bool   isinit  (選) 預設 false
     * @return  object
     */
    $.vmodel.get = function (name, isinit){

        // 返回所有倉儲
        if (!name) {
            return $.vmodel.api.obj_sort(storage);
        }

        var target_obj = storage[name];
        
        // 呼叫的倉儲並不存在
        if (!target_obj) {
            console.log("呼叫的倉儲名稱 "+ name +" 不存在。");
            return false;
        }

        // 當使用 true 的時候，會前往判斷，是否要觸發剛取得模型的 autoload()，若有就會優先觸發
        if (isinit == true) {
            $.vmodel.api.is_trigger_autocall(target_obj);
        }

        // 無論是否觸發使用者的 autoload(), 會後都會返回該實體化的物件
        return storage[name];
    }

    /**
     * 刪除指定的倉儲
     * @param   name (選)倉儲名稱, 不指定會清空所有倉儲
     */
    $.vmodel.delete = function (name){
        
        if (!name && name != '') {
            storage = {};
        } else {
            if (storage[name]) {
                delete storage[name];
            }
        }
        
        return this;
    }

    /**
     * 主要模式
     * @param  mix       p_1 若是 string 倉儲命名；若是 function 代表準備在內部實體化的方法 
     * @param  function  p_2 (選用) 若 p_1 為 string，就必須使用 p_2
     * @return this      
     */
    $.fn.vmodel = function(p_1, p_2, p_3) {

        // 內部
        local   = this;
        
        // 選擇器
        var selector = local.selector;

        // 若前兩個字元是定位符號，就自動去除
        this.remove_sign = function (str){
            return (str.substring(0, 2) == "--") ? str.substring(2) : str;
        }

        /**
         * 錯誤訊息
         * @param   method_name 提示錯誤的 function 名稱
         * @param   msg         錯誤訊息    
         */
        this.msg_error = function (method_name, msg){

            console.log("發生錯誤。『" + selector + "』呼叫的 function 『" + method_name + "』：" + msg);

        }


        this.main = function (){

            if ($.type(p_2) == "boolean" && p_2 === false) {

            }
            else {
                // 觸發自動讀取
                $.vmodel.api.is_trigger_autocall(obj);
            }

            return obj;
        }

        // 若第一個參數為倉儲命名
        if ($.type(p_1) == "string") {

            // 去除定位符號
            p_1 = local.remove_sign(p_1);

            // 若第二個參數為布林值
            if ($.type(p_2) == "boolean") {

                var obj      = new p_3();
            
            }

            // 若不是布林值，代表就是應該是要匿名方法, 我們將他實體化
            else {
            
                var obj      = new p_2();
            
            }

        }
        else {

            // 這是使用者定義的function, 我們將他實體化
            var obj      = new p_1();

        }

        // 擴充，外部不可使用這些關鍵字
        obj.selector = selector;
        obj.root     = $(this);

        
        



        

        var result = this.main();

        // 放入倉儲
        if ($.type(p_1) == "string") {

            // 檢查是否已存在
            if (!storage[p_1]) {
                storage[p_1] = result;
            }
            else {
                console.log("倉儲名稱『" + p_1 + "』重複。");
                return false;
            }
        }

        // 返回實體化的，可供外部調用
        return this;
    }


}( jQuery ));