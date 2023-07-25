async function getCurrencyData() {
  try {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных: ', error);
    return null;
  }
}

function displayCurrencyInfo(currencyData, selectedCurrency) {
  const currencyInfo = document.querySelector('.currency-info');
  const currencyId = document.getElementById('currency-id');
  const currencyName = document.getElementById('currency-name');
  const currencyCode = document.getElementById('currency-code');
  const currencyDate = document.getElementById('currency-date');
  const currencyValue = document.getElementById('currency-value');
  const currencyPreviousDate = document.getElementById('currency-previous-date');
  const currencyPreviousValue = document.getElementById('currency-previous-value');

  const selectedCurrencyData = currencyData.Valute[selectedCurrency];

  if (selectedCurrencyData) {
    currencyId.textContent = selectedCurrencyData.ID;
    currencyName.textContent = selectedCurrencyData.Name;
    currencyCode.textContent = selectedCurrencyData.CharCode;
    currencyDate.textContent = formatDateTime(currencyData.Date);
    currencyValue.textContent = selectedCurrencyData.Value;
    currencyPreviousDate.textContent = formatDateTime(currencyData.PreviousDate);
    currencyPreviousValue.textContent = selectedCurrencyData.Previous;
  }
}

function handleCurrencySelection() {
  const currencySelector = document.getElementById('currency-selector');
  const selectedCurrency = currencySelector.value;
  const currencyData = currencySelector.dataset.currencyData;

  displayCurrencyInfo(JSON.parse(currencyData), selectedCurrency);
}

function formatDateTime(date) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  return new Intl.DateTimeFormat('ru-RU', options).format(new Date(date));
}

document.addEventListener('DOMContentLoaded', async () => {
  const currencySelector = document.getElementById('currency-selector');

  const currencyData = await getCurrencyData();

  if (currencyData) {
    for (const currency in currencyData.Valute) {
      const option = document.createElement('option');
      option.value = currency;
      option.textContent = `${currencyData.Valute[currency].ID} - ${currencyData.Valute[currency].Name}`;
      currencySelector.appendChild(option);
    }

    currencySelector.dataset.currencyData = JSON.stringify(currencyData);

    currencySelector.addEventListener('change', handleCurrencySelection);

    handleCurrencySelection();
  }
});
