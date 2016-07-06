/**
 * Created by Ahmet on 31.05.2016.
 */
var mainAppCtrls = angular.module("mainAppCtrls");
/**
 * @ngdoc controller
 * @name mainAppCtrls.controller:WorkshopDetailsCtrl
 * @description Loads workshop details
 * @requires restSvcs.Workshops
 */
mainAppCtrls.controller('WorkshopDetailsCtrl',['$scope','Workshops', '$stateParams', "$alert","$translate",
    function($scope,Workshops,$stateParams, $alert, $translate) {
        //Get translations for errors and store in array
        var _translations = {};
        //Pass all required translation IDs to translate service
        $translate(['ALERT_ENROLLMENT_SUCCSESSFULL','ALERT_NO_PARTICIPANTS','FIRST_NAME','LAST_NAME','EMAIL']).
        then(function(translations){
            _translations = translations;
            $scope.placeholder =  {
                firstname: _translations.FIRST_NAME ,
                lastname: _translations.LAST_NAME,
                emailadress: _translations.EMAIL
            };
            
        });
        
        //TODO : replace with workshop details
        var workshopid = $stateParams.id;
        /**
         * @ngdoc function
         * @name mainAppCtrls.controller:WorkshopDetailsCtrl#sendInfo
         * @description Sends the info entered for enrollment to the server
         * @methodOf mainAppCtrls.controller:WorkshopDetailsCtrl
         */
        $scope.sendInfo= function(){
            var first_name=$scope.first_name;   
            var last_name=$scope.last_name;
            var _email=$scope.e_mail;

            //check if input is valid
            var _data = {
              //Data to be send  
              name: first_name,
              surname: last_name,
              email:   _email
            };
            //parameters for url
            var _params = {
              id: workshopid
            };
            Workshops.enroll(_params,_data).$promise.then(function(value,httpResponse){

                $alert({
                    title: 'Success',
                    type: 'success',
                    content: _translations.ALERT_ENROLLMENT_SUCCSESSFULL ,
                    container: '#alertEnroll',
                    dismissable: true,
                    duration: 20,
                    show: true,
                    animation: 'am-fade-and-slide-top'
                });
            },function(httpResponse){
                
                $alert({
                    title: 'Error',
                    type: 'danger',
                    content: httpResponse.status + ': '+ httpResponse.statusText,
                    container: '#alertEnroll',
                    dismissable: true,
                    duration: 20,
                    show: true,
                    animation: 'am-fade-and-slide-top'
                });
            });
        };

        $scope.unsubscribe= function(){
            var _params = {
              workshopId: workshopid,
                
            };
        };
        
        $scope.loading = true;
        Workshops.get({id: workshopid}).$promise.then(function(value){
            $scope.workshop = value;
            
            var _ea = Date.parse($scope.workshop.end_at);
            var _sa = Date.parse($scope.workshop.start_at);
            
            $scope.workshop.duration = new Date(_ea - _sa);
            $scope.loading = false;
        },function(httpResponse) {
            alert(httpResponse.status + '');
            $scope.loading = false;
        });
        $scope.loading = true;
        Workshops.getParticipants({id: workshopid}).$promise.then(function(value,httpResponse){
            $scope.participants = value;

            $scope.loading = false;
        },function(httpResponse) {
            switch(httpResponse.status){
                case 404:
                    $alert({
                        title: '',
                        type: 'info',
                        content: _translations.ALERT_NO_PARTICIPANTS,
                        container: '#alertParticipant',
                        dismissable: false,
                        show: true,
                        animation: 'am-fade-and-slide-top'
                    });
            }
            $scope.loading = false;
        });
        $scope.loading = true;
        Workshops.getWaitinglist({id: workshopid}).$promise.then(function(response){
            $scope.waitingList = response;
            $scope.loading = false;
        },function(response){
            $scope.loading = false;
        });

    }
]);