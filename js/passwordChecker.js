$(document).ready(function(){
	var passwordValue;
	var passwordCharactersArray;
	var analysis = $("#analysis");
	var suggestion = $("#suggestion");
	var passwordBaseLength = 8;
	var baseScore = 0;
	var totalScore = 0;

	//Object to store count of specific set of characters for analysis
	var Count = function(){
		this.Additional=0;
		this.UpperCase=0;
		this.Numbers=0;
		this.Symbols=0;
	};

	///Object to store bonus details
	var Bonus = function(){
		this.Additional=3;
		this.UpperCase=4;
		this.Numbers=5;
		this.Symbols=5;
		this.Combination=0;
		this.AllLowerCase=0;
		this.AllNumbers=0;
	};

	var countVar=new Count();
	var bonusVar=new Bonus();

	$("#password").on("keyup", doPasswordAnalysis);

//Begin password analysis on key up
function doPasswordAnalysis(){

	passwordValue= $("#password").val();
	passwordCharactersArray = passwordValue.split("");
	countVar=new Count();
	bonusVar=new Bonus();
	baseScore = 0;
	totalScore =0;

	if (passwordCharactersArray.length >= passwordBaseLength){
		baseScore = 50;
		analyzeString();
	}

	displayResult();
}

//Analyze the password text as a string
function analyzeString (){

	for (i=0; i<passwordCharactersArray.length;i++){
		if (passwordCharactersArray[i].match(/[A-Z]/g)) {countVar.UpperCase++;}
		if (passwordCharactersArray[i].match(/[0-9]/g)) {countVar.Numbers++;}
		if (passwordCharactersArray[i].match(/[!,@,#,$,%,^,&,*,?,_,~]/g)) {countVar.Symbols++;}
	}

	countVar.Additional = passwordCharactersArray.length - passwordBaseLength;

	if ((countVar.UpperCase && countVar.Numbers) || (countVar.UpperCase && countVar.Symbols) || (countVar.Numbers && countVar.Symbols)){
		bonusVar.Combination = 25;
	}
	calcComplexity();
}

//Calculate password complexity
function calcComplexity(){
	totalScore = baseScore
				+ (countVar.Additional*bonusVar.Additional)
				+ (countVar.UpperCase*bonusVar.UpperCase)
				+ (countVar.Numbers*bonusVar.Numbers)
				+ (countVar.Symbols*bonusVar.Symbols)
				+ bonusVar.Combination
				+ bonusVar.AllLowerCase
				+ bonusVar.AllNumbers;
}

/*
Display the analysis result and score breakdown

Strength Rules
<70  - Weak
70-90 - Average
90-110 - Strong
110+ - Secure

*/

function displayResult(){
	if ($("#password").val()== ""){
		analysis.html("Enter Password").removeClass("weak average strong secure");
	}
	else if ((passwordCharactersArray.length < passwordBaseLength) || (totalScore>=50 && totalScore <70)){
		analysis.html("Weak!").removeClass("average strong secure").addClass("weak");
		suggestion.html(getSuggestionText());
	}
	else if (totalScore>=70 && totalScore<90){
		analysis.html("Average!").removeClass("weak strong secure").addClass("average");
		suggestion.html(getSuggestionText());
	}
	else if (totalScore>=90 && totalScore<110){
		analysis.html("Strong!").removeClass("weak average secure").addClass("strong");
		suggestion.html("");
	}
	else if (totalScore>=110){
		analysis.html("Secure!").removeClass("weak average strong").addClass("secure");
		suggestion.html("");
	}


	$("#breakdown").html('Base Score :<span class="breakdownText">' + baseScore  + '</span><br />'
		+ 'Length Bonus :<span class="breakdownText">' + (countVar.Additional*bonusVar.Additional) + ' ['+countVar.Additional+'x'+bonusVar.Additional+']</span><br /> '
		+ 'Upper Case bonus :<span class="breakdownText">' + (countVar.UpperCase*bonusVar.UpperCase) + ' ['+countVar.UpperCase+'x'+bonusVar.UpperCase+']</span><br /> '
		+ 'Number Bonus :<span class="breakdownText"> ' + (countVar.Numbers*bonusVar.Numbers) + ' ['+countVar.Numbers+'x'+bonusVar.Numbers+']</span><br />'
		+ 'Symbol Bonus :<span class="breakdownText"> ' + (countVar.Symbols*bonusVar.Symbols) + ' ['+countVar.Symbols+'x'+bonusVar.Symbols+']</span><br />'
		+ 'Combination Bonus :<span class="breakdownText"> ' + bonusVar.Combination + '</span><br />'
		+ 'Lower case only penalty :<span class="breakdownText"> ' + bonusVar.AllLowerCase + '</span><br />'
		+ 'Numbers only penalty :<span class="breakdownText"> ' + bonusVar.AllNumbers + '</span><br />'
	+ 'Total Score:<span class="breakdownText"> ' + totalScore  + '</span><br />' );
}

//Display feedback to the user to improve password strength
function getSuggestionText(){
	if(passwordCharactersArray.length < passwordBaseLength){
		return "Enter at least 8 characters";
	}
	else if (!countVar.UpperCase && !countVar.Numbers && !countVar.Symbols){
		return "Consider including uppercase letters, numbers and symbols like !,@,#,$ etc. ";
	}else if(countVar.UpperCase && !(countVar.Numbers || countVar.Symbols)){
		return "Consider including numbers and symbols like !,@,#,$ etc.";
	}else if(countVar.Numbers && !(countVar.UpperCase || countVar.Symbols)){
		return "Consider including uppercase letters and symbols like !,@,#,$ etc.";
	}else if(countVar.Symbols && !(countVar.UpperCase || countVar.Numbers)){
		return "Consider including uppercase letters and numbers";
	}
}
});
