import Head from 'next/head'
import React from 'react'
import { marked } from 'marked';

import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import Layout from '@/components/layout'
import LibCommon from '@/lib/LibCommon'
//
function Page(props) {
  const item: any = props.item
console.log(item)
  let date = LibCommon.converDateString(item.createdAt);
  let content = item.content.replace(/<br \/>/gi, '\n');
  content = content.replace(/<doubleQuarts>/gi, '"');
//console.log(content)
  content = marked.parse(content);
//console.log(content)
  return (
  <Layout>
    <Head><title key="title">{item.title}</title></Head>
    <div className="container bg-light">
      <div className="hidden_print">
        <Link href="/todos">
          <a className="btn btn-outline-primary mt-2">Back</a></Link>
          {/*
        <hr className="my-1" />
        <div className="show_head_wrap">
          <i className="bi bi-house-fill mx-2"></i> ＞
            &nbsp;{item.title}
        </div>
          */}
      </div> 
      <div className="card shadow-sm my-2">
        <div className="card-body">
          <h1>{item.title}</h1>
          Date: {date}<br />
          ID: {item.id}
        </div>
      </div>           
      <div className="shadow-sm bg-white p-4 mt-2 mb-4">
        <div id="post_item" dangerouslySetInnerHTML={{__html: `${content}`}}>
        </div>
      </div>
    </div>
    <style>{`
      div#post_item img{
        max-width : 100%;
        height : auto;
      }
      #post_item pre{
        background-color: #EEE;
        padding: 0.5rem;
      }      
      .show_head_wrap{ font-size: 1.4rem; }
      .pdf_next_page {
        page-break-before: always;
        background-color: green;
        border: none;        
      }
      @media print {
        .hidden_print{
          display: none;
        }
      }
      `}</style>    
  </Layout>
  )
}
//
export const getServerSideProps = async (ctx) => {
  const id = ctx.query.id
  const data = await client.query({
    query: gql`
    query {
      todo(id:  ${id}) {
        id
        title
        content
        createdAt
      }                  
    }
    ` ,
    fetchPolicy: "network-only"
  });
console.log(data.data.todo); 
  const item = data.data.todo; 
  return {
    props: { item },
  }
}

export default Page

/*
  <Layout>
    <div className="container">
      <Link href="/todos">
        <a className="btn btn-outline-primary mt-2">Back</a></Link>
      <hr />
      <div><h1>Title : {item.title}</h1>
      ID: {item.id}      
      </div>
      <hr className="my-1" />
      <div id="post_item" 
        dangerouslySetInnerHTML={{ __html: content }}></div>      
      <hr />
    </div>
  </Layout>
*/