import Head from 'next/head'
import React from 'react'
import { marked } from 'marked';

import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import Layout from '@/components/layout'
import LibCommon from '@/lib/LibCommon';
import LibGraphql from '@/lib/LibGraphql';
//
function Page(props) {
  const item: any = props.item
//console.log(item)
  let date = LibCommon.converDateString(item.createdAt);
  let complete = LibCommon.converDateString(item.complete);
  let content = LibGraphql.getTagString(item.content);
//console.log(content)
  content = marked.parse(content);
  return (
  <Layout>
    <Head><title key="title">{item.title}</title></Head>
    <div className="container bg-light">
      <div className="hidden_print">
        <Link href={`/tasks?project=${item.projectId}`}>
          <a className="btn btn-outline-primary mt-2">Back</a></Link>
      </div> 
      <div className="card shadow-sm my-2">
        <div className="card-body">
          <h1>{item.title}</h1>
          Status : <span  className="text-primary">{item.status}</span><br />
          Scheduled : {complete}<br />
          Create : {date}<br />
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
      task(id: ${id}) {
        id
        projectId
        title
        content
        status
        complete
        createdAt
      }                        
    }
    ` ,
    fetchPolicy: "network-only"
  });
  const item = data.data.task; 
console.log(item); 
  return {
    props: { item },
  }
}

export default Page


