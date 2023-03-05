import React, { useEffect, useRef, useState } from "react";
import { IconButton, Tooltip, Divider } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import { getRequest, postRequest } from "../utilities/Api";
import { END_POINTS } from "../utilities/Constant";
import { getCookie, setCookie } from "../utilities/common.service";
import Typewriter from 'typewriter-effect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import './GptChatBot.scss'

const cookieName = 'gptChat';

export interface IQueryResponse {
  query: string;
  id: string;
  response: string;
}

export interface IUserInfo {
  userName: string;
  apiKey: string;
}

const textLimit = 10

export function GptChatBot(props) {

  const testingResponse = []

  const initialUserInfo = {
    userName: '',
    apiKey: ''
  }

  const [userInput, setUserInput] = useState('')
  const [isleftPanel, setIsleftPanel] = useState(false)
  const scrollBarRef = useRef(null)
  const [userInfo, setUserInfo] = useState<IUserInfo>(initialUserInfo)
  const [isAnimationStart, setIsAnimationStart] = useState(false)
  const [queryResponse, setQueryResponse] = useState<IQueryResponse[]>(testingResponse)
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)


  const handleKeyDown = (e) => {

    const keyCode = e.which || e.keyCode;
    if (keyCode === 13 && !e.shiftKey) {
      // Don't generate a new line
      e.preventDefault();
      fetchResponse()
      // Do something else such as send the message to back-end
      // ...
    } else {
      e.target.style.height = 'inherit';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }

  }

  useEffect(() => {
    const currentCookie = getCookie(cookieName);
    if (currentCookie) {
      // set new cookie
      const info = JSON.parse(currentCookie)
      setUserInfo(info)
      setApiKey(info.apiKey)
      fetchPreviousResponse()
    }

  }, [apiKey])

  const inputChange = (event) => {
    if (!event || !event.target) return;

      const _p = event.target.value.substring(0, textLimit)
      setUserInput(_p)
  }

  const setKey = () => {
    if (!apiKey) {
      alert('Please Enter Your API Key')
      return
    }

    postRequest(`${END_POINTS.BASE_URL}/set-key?key=${apiKey}`, null).then(res => {

      const currentCookie = getCookie(cookieName);

      if (!currentCookie) {
        // set new cookie
        const userInfo = {
          userName: res.accountName,
          apiKey: apiKey
        }

        setCookie(cookieName, JSON.stringify(userInfo), 100)
        setUserInfo(userInfo)
      }
    }).catch(err => {
      console.log(err)
    })

  }

  const setScrollToBottom = () => {
    setTimeout(() => {
      if (scrollBarRef.current) {
        scrollBarRef.current.scrollTop = scrollBarRef.current.scrollHeight
      }
    }, 250)
  }

  const fetchPreviousResponse = () => {
    if (!userInfo?.userName) return;

    const userID = userInfo.userName
    getRequest(`${END_POINTS.BASE_URL}/query?user_id=${userID}&limit=${10}`).then((queryResponses: any[]) => {
      const responses = queryResponses.map(item => ({ query: item.query, response: item.response, id: item._id }))
      setQueryResponse([...queryResponse, ...responses])
      setScrollToBottom()
    })
  }

  const fetchResponse = () => {
    if (!userInput || !userInfo?.userName) return;

    const userID = userInfo.userName
    const reqBody = {
      "query": userInput
    }
    setUserInput('')
    postRequest(`${END_POINTS.BASE_URL}/query?user_id=${userID}`, reqBody).then(res => {
      console.log('res', res)
      setScrollToBottom()
      setQueryResponse([...queryResponse, {
        query: `${userInput}`,
        response: `${res.response}`,
        id: `${Math.random()}`
      }])
      setIsAnimationStart(true)

    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <>
      <div id="__next">
        <div className="relative">
          <div className={`hidden md:flex md:w-62 h-screen md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900 left-panel ${isleftPanel ? ' opened' : ''}`}>
            <div className="py-5 flex flex-col h-full text-sm text-white font-bold overflow-auto">
              <div className="d-flex flex-column justify-content-between h-full">
                <div>
                  <div className="align-items-center d-flex ml-3">
                    <a className="h-fit w-24 d-flex" href="/" title="Prompts Lab">
                      <img alt="Logo" src="https://avatars.githubusercontent.com/u/120981762" />
                    </a>
                    <h4>PromptsLab</h4>
                  </div>
                  <div className="close-btn" onClick={e => setIsleftPanel(!isleftPanel)}>
                    <CloseIcon />
                  </div>
                  <h5 className="mx-3 px-1 mb-0">About us</h5>
                  <p className="font-normal p-2 text-justify text-gray-1 about-text">
                    PromptLab is dedicated to developing open-source tools and libraries that support developers in creating robust pipelines for using LLMs APIs in production. With these tools, developers can focus on building the logic of their NLP application, while the library handles the complexities of integrating LLMs into their pipeline. Join us and discover the true potential of LLMs in healthcare and business applications!
                  </p>
                  <p className="font-normal p-2 text-justify text-gray-500">
                    We are currently in the process of implementing a feature that will allow users to access their previous history and create a login/signup page for state management. This will enhance the user experience and provide a more secure and personalized platform.
                  </p>
                </div>
                <div className="prompt-footer font-normal d-flex justify-content-center">
                  <Divider>
                    <div className="d-flex align-items-center">
                      <span>Made with</span>
                      <FavoriteIcon sx={{ color: '#f44336', margin: '0 0.75rem' }} />
                      <span>by <a href="https://github.com/promptslab/chat.goprompt.ai" target="_blank" className="organization-name">Promptslab</a></span>
                    </div>
                  </Divider>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 h-screen right-panel md:pl-62">
            <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-topBar lg:shadow-none">
              <button type="button" className="px-4 text-gray-500 md:hidden" onClick={e => setIsleftPanel(!isleftPanel)}>
                <span className="sr-only">Open sidebar</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 12H20.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round"></path>
                  <path d="M3.75 6H20.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M3.75 18H20.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
              <div className="flex-1 px-3 flex justify-between">
                <div className="flex gap-3 items-center w-100 justify-center">

                  Key: <input type="text" value={apiKey} disabled={userInfo?.userName ? true : false} onChange={e => setApiKey(e.target.value)} className="api-key-input border rounded-md p-1 border-gray-6 w-100" placeholder="Enter API Key" />
                  <Tooltip title="Set Key" placement="right">
                    <IconButton color="primary" component="label" onClick={setKey}>
                      <CheckCircleIcon color="info" />
                    </IconButton>
                  </Tooltip>

                  <></>
                </div>
              </div>
            </div>
            <main className="flex-1 flex flex-col overflow-auto relative py-4">
              <div className="flex-1 flex flex-col overflow-auto -mb-2">
                <div className="flex-1 flex flex-col overflow-auto">
                  <div ref={scrollBarRef}
                    className="flex-1 overflow-auto flex flex-col pt-2 pb-8 sm:py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                    {
                      queryResponse.map((item, idx) => {
                        return (<React.Fragment key={idx}>
                          <div className="asked-prompt relative px-4 lg:px-2 group py-2">
                            <div className="mx-auto max-w-900 py-2 flex justify-between space-x-2">
                              <div className="grid grid-cols-12 overflow-auto w-full"
                                id="6b918404-fa4e-40d0-8a6e-42dd2b3476cd">
                                <div className="ml-1 w-10 h-10 col-span-2 md:col-span-1">
                                  <span className="convert-3">
                                    <AccountCircleIcon fontSize="large" />
                                  </span>
                                </div>
                                <div className="col-span-9 md:col-span-11 flex flex-col">
                                  <div className="whitespace-pre-wrap h-fit md:ml-2 lg:ml-0">
                                    {item.query}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="prompt-response bg-indigo-50 relative px-3 lg:px-2 group py-2 border-t border-b border-indigo-100">
                            <div className="mx-auto max-w-900 py-2 flex justify-between space-x-2">
                              <div className="grid grid-cols-12 overflow-auto w-full">
                                <div className="w-11 h-11 col-span-2 md:col-span-1">
                                  <span className="convert-3">
                                    <img alt="Member" src="https://avatars.githubusercontent.com/u/120981762" />
                                  </span>
                                </div>
                                <div className="col-span-9 md:col-span-11 flex flex-col">
                                  <div className="whitespace-pre-wrap h-fit md:ml-2 lg:ml-0">
                                    {
                                      (queryResponse.length - 1) === idx && isAnimationStart ?
                                        <Typewriter options={{ delay: 40 }}
                                          onInit={(typewriter) => {
                                            typewriter.typeString(`${item.response}`)
                                              .callFunction(() => {
                                                setScrollToBottom()
                                                setIsAnimationStart(false)
                                              })
                                              .pauseFor(2500)
                                              .start();
                                          }}
                                        /> : item.response
                                    }

                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </React.Fragment>)
                      })
                    }


                  </div>
                  <div className="w-full px-4">
                    <div className="mx-auto max-w-900 py-1 w-full mt-2 mb-5" id="scrollToBottom">
                      <div className="w-full">

                        <div className="relative flex justify-between items-end">
                          <div className="bg-purple-4 rounded-xl w-full">

                            <div className="w-full flex relative items-center relative">
                              <div className="flex-1">
                                <textarea value={userInput} disabled={!userInfo?.userName || isAnimationStart} onChange={inputChange} onKeyDown={handleKeyDown}
                                  className=" scroll-py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full resize-none autosizeArea appearance-none block w-full px-3 py-2 border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-1 focus:border-transparent text-base max-h-48 pr-10 bg-white py-3 rounded-lg text-sm"
                                  placeholder="Write Your Prompt"></textarea>
                              </div>
                              <div className="absolute right-2 cursor-pointer">
                                <Tooltip title="Send" placement="left">
                                  <IconButton color="primary" aria-label="upload picture" disabled={!userInfo?.userName || isAnimationStart} component="label" onClick={fetchResponse}>
                                    <SendIcon />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex justify-content-between items-center w-full pr-1">
                        <p className="m-2 text-xs font-semibold text-gray-6">shift + enter for new line</p>
                        <p className="m-2 text-xs font-semibold text-gray-6">{userInput.length || 0} / {textLimit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
