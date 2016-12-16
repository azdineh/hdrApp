angular.module('hdrApp').controller('HomeController', function($scope, hdrFileSystem) {
    $scope.page="home";

});






angular.module('hdrFilters',[])
.filter('hdrage',function(){

     /**
     * return Date()
     * @param  {string} FrShortDateString string present french short date format like : dd/mm/yyyy
     * @return {Date}  Date object.
     */
    var parseShortDate=function(FrShortDateString){
        var str=FrShortDateString.trim();
        var dd=parseInt(str.substr(0,2));
        var mm=parseInt(str.substr(3,2))-1; // JS counts months from 0 to 11;
        var yyyy=parseInt(str.substr(6,4));

        return new Date(yyyy,mm,dd);
    }

    /**
     * calculate the age from a simple string format of the date
     * @param  {string} dateSimpleStringFormat this param present a date with format : dd/mm/yyyy
     * @return {string} the age, Example: if the age=16.7 return 16.5,
     * if the age= 16.3 rerun 16.
 *  */
    var calculateAge=function(dateSimpleStringFormat){
        var age=0;
        var birthdate=parseShortDate(dateSimpleStringFormat);

        var ageDifMs = Date.now() - birthdate.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        var ageYear = Math.abs(ageDate.getUTCFullYear() -1970);
        var ageMonth = ageDate.getUTCMonth();
        if(ageMonth<=6){
            age=ageYear;
        }else{
            age=ageYear+"½";
        }
        return age;

    }

    return function(input){     
        return calculateAge(input);
    };

    
})
.filter('hdrnumber',function(){
    return function(input){
        var hdrnumber='00';
        if(input<=9){
            hdrnumber='0'+input;
        }else{
        	hdrnumber=input;
        }
        return hdrnumber;
    }
});