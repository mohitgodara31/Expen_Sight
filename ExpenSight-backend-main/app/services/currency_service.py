import httpx
from fastapi import HTTPException
from datetime import date

FRANKFURTER_API_URL = "https://api.frankfurter.app"

async def get_historical_fx_rate(
        from_currency:str,
        to_currency:str,
        transaction_date:date
)->float:
    """
    Fetches the historical foreign exchange rate for a specific date.

    This function calls the Frankfurter API to get the conversion rate between
    two currencies on the date of the transaction. If the transaction date is
    in the future or on a weekend/holiday, the API automatically provides the
    rate from the closest preceding business day.

    Args:
        from_currency: The original currency code of the expense (e.g., "USD").
        to_currency: The target currency code for conversion (e.g., "INR").
        transaction_date: The date of the original transaction.

    Returns:
        The exchange rate as a float (e.g., 83.50).

    Raises:
        HTTPException(400): If the 'from_currency' is not supported by the API.
        HTTPException(503): If the external FX API is unavailable or fails.
    """
    clean_from = from_currency.upper().strip()
    clean_to = to_currency.upper().strip()

    if clean_from == clean_to:
        return 1.0
    
    date_str = transaction_date.strftime('%Y-%m-%d')

    request_url = f"{FRANKFURTER_API_URL}/{date_str}?from={clean_from}&to={clean_to}"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(request_url)

            response.raise_for_status()
        
        data = response.json()

        if 'rates' in data and clean_to in data['rates']:
            return data['rates'][clean_to]
        else:
            raise HTTPException(status_code=503,detail=f"FX API did not return a rate for {clean_to}")
    
    except httpx.HTTPStatusError as e:
        # This catches errors returned by the API, like 404 for an invalid currency.
        if e.response.status_code == 404:
            raise HTTPException(
                status_code=400,
                detail=f"The currency code '{clean_from}' is not supported or invalid."
            )
        # For any other HTTP error, we assume the service is unavailable.
        raise HTTPException(
            status_code=503, 
            detail=f"External FX service failed with status {e.response.status_code}."
        )
    except httpx.RequestError:
        # This catches network-level errors (e.g., DNS failure, connection refused).
        raise HTTPException(
            status_code=503, 
            detail="Could not connect to the external FX service."
        )