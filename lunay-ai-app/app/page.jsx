'use client';

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <a href="#" className="inline-flex space-x-6">
                    <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                      What's new
                    </span>
                    <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                      <span>Just shipped v1.0</span>
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </a>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Luna AI - Your AI Agent Platform
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Create, customize, and collaborate with intelligent AI agents. Luna AI provides a powerful platform for building custom AI agents with natural language capabilities, long-term memory, and tool integrations.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href="/signup"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </Link>
                  <Link href="/try-luna" className="text-sm font-semibold leading-6 text-gray-900">
                    Try Luna AI <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div
              className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36"
              aria-hidden="true"
            />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <div
                  className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36"
                  aria-hidden="true"
                />
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                      <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                        <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                          <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                            AgentDialog.jsx
                          </div>
                          <div className="border-r border-gray-600/10 px-4 py-2">
                            MessageList.jsx
                          </div>
                        </div>
                      </div>
                      <div className="px-6 pt-6 pb-14 text-gray-300">
                        {/* Simulated code snippet */}
                        <pre className="text-sm text-gray-300">
                          <code>
                            <span className="text-indigo-400">function</span>{" "}
                            <span className="text-cyan-300">AgentChatComponent</span>
                            <span className="text-white">()</span>{" "}
                            <span className="text-white">{'{'}</span>
                            <br />
                            <span className="text-gray-300">  </span>
                            <span className="text-indigo-400">const</span>{" "}
                            <span className="text-white">[messages, setMessages]</span>{" "}
                            <span className="text-indigo-400">=</span>{" "}
                            <span className="text-cyan-300">useState</span>
                            <span className="text-white">([])</span>
                            <br />
                            <span className="text-gray-300">  </span>
                            <span className="text-indigo-400">const</span>{" "}
                            <span className="text-white">{'{ agent, isLoading }'}</span>{" "}
                            <span className="text-indigo-400">=</span>{" "}
                            <span className="text-cyan-300">useAgent</span>
                            <span className="text-white">(agentId)</span>
                            <br />
                            <br />
                            <span className="text-gray-300">  </span>
                            <span className="text-indigo-400">return</span>{" "}
                            <span className="text-white">(</span>
                            <br />
                            <span className="text-gray-300">    </span>
                            <span className="text-indigo-400">&lt;</span>
                            <span className="text-white">div</span>{" "}
                            <span className="text-cyan-300">className</span>
                            <span className="text-indigo-400">=</span>
                            <span className="text-amber-300">"agent-container"</span>
                            <span className="text-indigo-400">&gt;</span>
                            <br />
                            <span className="text-gray-300">      </span>
                            <span className="text-indigo-400">&lt;</span>
                            <span className="text-white">MessageList</span>{" "}
                            <span className="text-cyan-300">messages</span>
                            <span className="text-indigo-400">=</span>
                            <span className="text-white">{'{'}</span>{" "}
                            <span className="text-white">messages</span>{" "}
                            <span className="text-white">{'}'}</span>{" "}
                            <span className="text-indigo-400">/&gt;</span>
                            <br />
                            <span className="text-gray-300">      </span>
                            <span className="text-indigo-400">&lt;</span>
                            <span className="text-white">MessageInput</span>{" "}
                            <span className="text-cyan-300">onSend</span>
                            <span className="text-indigo-400">=</span>
                            <span className="text-white">{'{'}</span>{" "}
                            <span className="text-white">handleSend</span>{" "}
                            <span className="text-white">{'}'}</span>{" "}
                            <span className="text-indigo-400">/&gt;</span>
                            <br />
                            <span className="text-gray-300">    </span>
                            <span className="text-indigo-400">&lt;/</span>
                            <span className="text-white">div</span>
                            <span className="text-indigo-400">&gt;</span>
                            <br />
                            <span className="text-white">  )</span>
                            <br />
                            <span className="text-white">{'}'}</span>
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32"
          aria-hidden="true"
        />
      </div>

      {/* Feature section */}
      <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Build Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to create advanced AI agents
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Luna AI provides all the tools and features you need to create, customize, and deploy powerful AI agents for various tasks and use cases.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <svg className="h-5 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clipRule="evenodd" />
                </svg>
                <span>Custom AI Agents (Nomis)</span>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Create and customize AI agents with specific roles, personalities, and capabilities. Set goals and behaviors tailored to your needs.
                </p>
                <p className="mt-6">
                  <a href="#" className="text-sm font-semibold leading-6 text-indigo-600">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <svg className="h-5 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                <span>Long-Term Memory</span>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Agents retain context and information across conversations. Edit and manage agent memories through an intuitive interface.
                </p>
                <p className="mt-6">
                  <a href="#" className="text-sm font-semibold leading-6 text-indigo-600">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <svg className="h-5 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                </svg>
                <span>Tool & API Integration</span>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Connect your agents to external tools and APIs, enabling them to perform a wide range of actions and access real-time information.
                </p>
                <p className="mt-6">
                  <a href="#" className="text-sm font-semibold leading-6 text-indigo-600">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-32 px-6 py-32 sm:mt-40 sm:py-40 lg:px-8">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width={200}
              height={200}
              x="50%"
              y={-64}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-64} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M299.5 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
        </svg>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ready to experience Luna AI?</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Sign up now and start building your own custom AI agents in minutes, not days.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}