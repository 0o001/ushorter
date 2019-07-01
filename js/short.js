window.onload = function ()
{
	var apiUrl = 'https://api-ssl.bitly.com/v3/shorten?access_token=YOUR_TOKEN&longUrl=';

	var longUrl = document.querySelector('input[name="longUrl"]');
	var toShortButton = document.querySelector('input[name="toShortButton"]');
	var refresh = document.querySelector('.header-back');
	var loadingImage = document.querySelector('.loading-image');
	var message = document.querySelector('.message-span');
	var bitlyLink = document.querySelector('.header-bitly');

	longUrl.focus();

	refresh.addEventListener('click', function ()
	{
		window.location.reload();
	});

	longUrl.addEventListener('keyup', function(event)
	{
	    event.preventDefault();

	    var text = longUrl.value;
	    longUrl.style.borderColor = '';

	    if(text.trim())
	    {
	    	toShortButton.disabled = false;
		    if (event.keyCode == 13)
		    {
		        toShortButton.click();
	    	}
	    }
	    else
	    {
	    	toShortButton.disabled = true;
	    }
    });

	toShortButton.onclick = function ToShort()
	{

		if(navigator.onLine)
		{
			var url = httpAdd(longUrl.value);

			if(httpExist(url))
			{
				getJSON(apiUrl + url,
				function(err, bitlyData)
				{

					loadingImage.style.display = 'none';
					if (err != null)
					{
						createMessage('Bir hata oluştu', '#ED3740');
					} 
					else
					{
						if(typeof bitlyData.data.url !== 'undefined')
						{
							createShort(bitlyData.data.url);
						}
						else
						{
							var status = bitlyData.status_txt;
							switch(status)
							{
								case 'ALREADY_A_BITLY_LINK':
									createShort(url);
									break;
								case 'INVALID_URI':
									createMessage('Url değil', '#ED3740');
									break;
								case 'MISSING_ARG_URI':
									createMessage('Boş url', '#ED3740');
									break;
								default:
									createMessage('Bir hata oluştu', '#ED3740');
									break;
							}
						}
					}
				},
				function ()
				{
			    loadingImage.style.display = 'inline-block';
				});
			}
			else
			{
				createMessage('Url\'yi kontrol ediniz', '#ED3740');
			}
		}
		else
		{
			createMessage('İnternet bağlantı sorunu', '#ED3740');
		}

	}

	function createShort(shortLink)
	{
		longUrl.value = shortLink;

		longUrl.select();
		longUrl.readOnly = true;
		toShortButton.value = 'Kopyala';
		
		toShortButton.onclick = function()
		{
			longUrl.select();
			document.execCommand('copy');
		};

		longUrl.addEventListener('copy', function ()
		{
			createMessage('Kopyalandı!', '#4CAF50');
		});

		bitlyLink.style.display = 'none';
		refresh.style.display = 'block';
	}

	function createMessage(text, backColor)
	{
		message.style.backgroundColor = backColor;
		message.innerText = text;
		message.style.display = 'inline-block';

		setTimeout(function ()
		{
			message.style.display = 'none';
			message.innerText = '';
		}, 2500);
	}

};

var getJSON = function(url, callback, progress = {})
{
	var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onprogress = progress;

    xhr.onload = function()
    {

      var status = xhr.status;
      if (status == 200)
      {
        callback(null, xhr.response);
      }
      else
      {
        callback(status);
      }

    };

    xhr.send();
}

function httpAdd(url)
{
	if(!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('ftp://') && !url.startsWith('file://'))
	{
		url = 'http://' +  url;
	}
	return url;
}

function httpExist(url)
{
	var regex = new RegExp(/\(?(?:(http|https):\/\/)(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/);

	if(regex.test(url))
	{
		return true;
	}
	else
	{
		return false;
	}
}