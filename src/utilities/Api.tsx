
export const postRequest = (URI, reqBody) => {
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: reqBody ? JSON.stringify(reqBody) : null
    };

    return fetch(URI, requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            // console.log('response', data)
            return data
        })
        .catch(error => {
            console.error('There was an error!', error);
        });

}

export const getRequest = (URI) => {
    
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    return fetch(URI, requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            // console.log('response', data)
            return data
        })
        .catch(error => {
            console.error('There was an error!', error);
        });

}
