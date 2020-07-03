$(document).ready(function(){
     
          $(".burger-nav").on("click", function(){
                
                $(".navbar ul").toggleClass("open");
                $("#bio").toggleClass("open");
                $(".contactform").toggleClass("open");
                $("#aboutBody").toggleClass("open");
                $("#UpcomingShows").toggleClass("open");
                $(".slideshow-container").toggleClass("open");
                $(".previous").toggleClass("open");
                $(".next").toggleClass("open");
                $(".burger-nav").toggleClass("open");
                $(".gallery").toggleClass("open");
            });        
                                   
});