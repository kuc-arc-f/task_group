import Head from 'next/head'
import React from 'react'
import { marked } from 'marked';
import Router from 'next/router'

import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import LibCommon from '@/lib/LibCommon';
import LibGraphql from '@/lib/LibGraphql';
import LibCookie from '@/lib/LibCookie';
//
interface IState {
  title: string,
  content: string,
  _token: string,
  userId: string,
  button_display: boolean,
  item: any,
  complete: string,
  createdAt: string,
}
interface IProps {
  id: string,
  csrf: any,
  item: any,
  complete_type: number,
}
//
export default class Page extends React.Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      title: '', 
      content: '',
      _token : '',
      userId: '', button_display: false, item: {},
      complete: '', createdAt: '',
    }
//console.log(props)
  }
  async componentDidMount(){
    try{
      const key = process.env.COOKIE_KEY_USER_ID;
      const uid = LibCookie.get_cookie(key);
// /console.log( "user_id=" , uid)    
      if(uid === null){
        Router.push('/auth/login');
      }else{
        const data = await client.query({
          query: gql`
          query {
            task(id: ${this.props.id}) {
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
        let content = LibGraphql.getTagString(item.content);
        let date = LibCommon.converDateString(item.createdAt);
        let complete = LibCommon.converDateString(item.complete);
//console.log(item);
        this.setState({
          item : item, content: content, button_display: true,
          complete: complete, createdAt: date,
        });
      }      
    } catch (e) {
      console.error(e);
    }    
  }
  render(){
    const item: any = this.state.item;
//console.log(item.content);
    const content = marked.parse(this.state.content);
    return (
    <Layout>
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )
      }       
      <Head><title key="title">{item.title}</title></Head>
      <div className="container bg-light">
        <div className="hidden_print">
          <div className="row">
            <div className="col-md-6">
              <Link href={`/tasks?project=${item.projectId}`}>
                <a className="btn btn-outline-primary mt-2">Back</a>
              </Link>
            </div>
            <div className="col-md-6 text-end">
              <Link href={`/tasks/edit/${this.props.id}`}>
                <a className="btn btn-primary mx-2 mt-2">Edit</a>
              </Link>
            </div>
          </div>
        </div> 
        <div className="card shadow-sm my-2">
          <div className="card-body">
            <h1>{item.title}</h1>
            Status : <span  className="text-primary">{item.status}</span><br />
            Scheduled : {this.state.complete}<br />
            Create : {this.state.createdAt}<br />
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
}
//
export const getServerSideProps = async (ctx) => {
  const id = ctx.query.id
  return {
    props: { id: id, },
  }
}


