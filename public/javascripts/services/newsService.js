app.factory('newsService',function($http){
  
var state_dict = {
        'AK': 'Alaska',
        'AL': 'Alabama',
        'AR': 'Arkansas',
        'AS': 'American Samoa',
        'AZ': 'Arizona',
        'CA': 'California',
        'CO': 'Colorado',
        'CT': 'Connecticut',
        'DC': 'District of Columbia',
        'DE': 'Delaware',
        'FL': 'Florida',
        'GA': 'Georgia',
        'GU': 'Guam',
        'HI': 'Hawaii',
        'IA': 'Iowa',
        'ID': 'Idaho',
        'IL': 'Illinois',
        'IN': 'Indiana',
        'KS': 'Kansas',
        'KY': 'Kentucky',
        'LA': 'Louisiana',
        'MA': 'Massachusetts',
        'MD': 'Maryland',
        'ME': 'Maine',
        'MI': 'Michigan',
        'MN': 'Minnesota',
        'MO': 'Missouri',
        'MP': 'Northern Mariana Islands',
        'MS': 'Mississippi',
        'MT': 'Montana',
        'NA': 'National',
        'NC': 'North Carolina',
        'ND': 'North Dakota',
        'NE': 'Nebraska',
        'NH': 'New Hampshire',
        'NJ': 'New Jersey',
        'NM': 'New Mexico',
        'NV': 'Nevada',
        'NY': 'New York',
        'OH': 'Ohio',
        'OK': 'Oklahoma',
        'OR': 'Oregon',
        'PA': 'Pennsylvania',
        'PR': 'Puerto Rico',
        'RI': 'Rhode Island',
        'SC': 'South Carolina',
        'SD': 'South Dakota',
        'TN': 'Tennessee',
        'TX': 'Texas',
        'UT': 'Utah',
        'VA': 'Virginia',
        'VI': 'Virgin Islands',
        'VT': 'Vermont',
        'WA': 'Washington',
        'WI': 'Wisconsin',
        'WV': 'West Virginia',
        'WY': 'Wyoming'
}
var topSportsNews = function (state, string_words,limit) {
    var val_state= state_dict[state];
    var query_string = val_state.concat(" ");
    var query_string = query_string.concat(string_words);
    url = `https://newsapi.org/v2/everything?q=${query_string} &sortBy=relevance&apiKey=5c4aad7679184604bff739892b078d65`;
    console.log(url);
    return $http.get(url).then(function (response) {
        console.log(response.data.articles);
        var newsList = [];
        for (var index =0 ;index<response.data.articles.length;index++){
            news = response.data.articles[index];
            if(news.urlToImage){
                newsList.push(news);
            }
            if(newsList.length==limit){
                return newsList;
            }
        }
        return newsList;
    });
};
var topBenefitNews = function (value,limit) {
    var query_string = value.concat(" Healthcare Coverage");
    //var query_string = query_string.concat(string_words);
    url = `https://newsapi.org/v2/everything?q=${query_string} &sortBy=relevance&apiKey=5c4aad7679184604bff739892b078d65`;
    console.log(url);
    return $http.get(url).then(function (response) {
        console.log(response.data.articles);
        var newsList = [];
        for (var index =0 ;index<response.data.articles.length;index++){
            news = response.data.articles[index];
            if(news.urlToImage){
                newsList.push(news);
            }
            if(newsList.length==limit){
                return newsList;
            }
        }
        return newsList;
    });
};

return {

    topSportsNews: topSportsNews,
    topBenefitNews: topBenefitNews
};
});
