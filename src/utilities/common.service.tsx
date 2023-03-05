import React from "react";
import { postRequest } from "./Api";
import { END_POINTS } from "./Constant";

export function RunPrompt(requestBody) {
    postRequest(END_POINTS.BASE_URL, requestBody)
}

export function DateConvert(date = null): string {
    // const _date = new Date(date).toLocaleDateString()
    const _date = new Date().toLocaleDateString()
    return _date
}

export function firstLetterUppercase(value = ''): string {
    if (!value) return '';

    return value.substring(0, 1).toUpperCase() + value.substring(1, value.length)
}

const promptToken = {};
// integrate API to calcuate tokens

export const fetchTokenSize = async (input) => {
    const reqBody = { input }
    return await postRequest(`${END_POINTS.BASE_URL}/tokenizer`, reqBody)
}

export async function getTokensize(input = ''): Promise<any> {
    if (!input) return 0;

    return await fetchTokenSize(input).then(res => {
        promptToken[input] = res
        console.log('(promptToken', (promptToken[input]?.token_legth || 0))
        return (promptToken[input]?.token_legth || 0);
    })

}

export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export const generatePrompt = async ({prompt, apiKey}) => {

    const reqBody = { prompt, apiKey }

    postRequest(`${END_POINTS.BASE_URL}/run-prompt?isGenerate=true`, reqBody).then(response => {
        console.log('res', response)
        const { generatedPrompt = {} } = response

        console.log('generatedPrompt', generatedPrompt)
        // const { D, OP, BB } = res[0]

        // const promise1 = fetchTokenSize(D);
        // const promise2 = fetchTokenSize(OP);
        // const promise3 = fetchTokenSize(BB);

        return Promise.all([])

        // const response: any[] = initialResponse.map(prompt => {
        //     if (prompt.title === 'Detailed') {
        //         prompt.value = D,
        //         getTokensize(generatedPrompt(D)).then(res => {
        //             console.log("token", res)
        //             prompt.tokenSize = res
        //         })
        //     }
        //     if (prompt.title === 'Optamized') {
        //         prompt.value = OP,
        //         prompt.tokenSize = 0
        //     }
        //     if (prompt.title === 'Relevent') {
        //         prompt.value = BB,
        //         prompt.tokenSize = 0
        //     }

        //     return prompt
        // })
    }).then(res => {
        console.log("final", res)
        return res
    }).catch(err => {
        console.log(err)
    })
    // return await postRequest(`${END_POINTS.BASE_URL}/tokenizer`, reqBody)
}

const parseWithRegex = (value = null) => {
    if(!value) return;

    const regex = new RegExp(`(.*)\[\{'\bD\b':(\s|)"(.*)",(.*)'\bOP\b':(\s|)"(.*)",(.*)'\bBB\b':(\s|)"(.*)",(.*)'\bDV\b':(\s|)\["(.*)"\]\}\](.*)`)
    return value.replace(regex, `{D: "$0", OP:  "$6", BB: "$9", DV: ["$12"]}`)

}

export const  promptParsing = async (value : string = '')  => {
    if(!value) return;

    const trimmedText = value.replace(/(\r\n|\n|\r)/gm, "")
     const prompts = {}
     const promise : Promise<any>[] = []    
     trimmedText.split('",').forEach(text => {
        const textArray = text.replace('\"', '').replace('[{', '').trim().split(":")
        const [key, value = null] = textArray

        if(key && value){
            promise.push(fetchTokenSize(value))
            const parseKey = key.replaceAll("'", "")
            prompts[parseKey] = { value }
        }

    })

    return await new Promise((resolve, reject) => {
        Promise.all(promise).then(promptTokens => {
            const [ DToken, OPToken, BBToken ] = promptTokens
            
            prompts['D'] = { ...prompts['D'], token: DToken }
            prompts['OP'] = { ...prompts['OP'], token: OPToken }
            prompts['BB'] = { ...prompts['BB'], token: BBToken }
            
            resolve(prompts)
        }).catch(err => {
            reject(err)
        })
    })

}

export const fetchSentiment = async (input: string) => {
    if (!input) return;

    const reqBody = { input }
    return await postRequest(`${END_POINTS.BASE_URL}/fetch-sentiments`, reqBody)
}

export interface ISentiment {
    label: string;
    value: string;
}

export const getSentiment = (sentimentArray: any[] = []): ISentiment => {
    if (!sentimentArray || sentimentArray.length === 0) return;
    sentimentArray = sentimentArray.length === 1 ? sentimentArray[0] : sentimentArray // temporary fix
    const currentSentiment = sentimentArray.reduce((acc, value) => {
        return value.score >= acc.score ? value : acc
    }, { score: 0 })

    return convertSentiment(currentSentiment)
}

export const convertSentiment = (sentiment: any = {}): ISentiment => {
    if (!sentiment || !sentiment.label) return;

    switch (sentiment.label) {
        case 'LABEL_0':
            return { label: 'negative', value: '🙁' }
        case 'LABEL_1':
            return { label: 'negative', value: '🙁' }
        case 'LABEL_2':
            return { label: 'positive', value: '🙂' }
    }
}

export function calculateCharacters(value = ''): number {
    if (!value) return 0;

    return value.length
}

export function debounce(callback: Function, timer: number = 500, triggerValue): any {
    if (!(callback instanceof Function)) return 0;

    React.useEffect(() => {
        const startTimeout = setTimeout(() => {
            console.log("calling")
            callback()
        }, timer)

        return () => clearTimeout(startTimeout)
    }, [triggerValue])
}
