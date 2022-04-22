//import Head from 'next/head'
import Link from 'next/link';
import Router from 'next/router'
import React from 'react'
import flash from 'next-flash';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import LibCookie from "@/lib/LibCookie";
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'

interface IState {
  name: string,
  _token: string,
  userId: string,
  button_display: boolean,
}
interface IProps {
  id: string,
  csrf: any,
  item: any,
  complete_type: number,
}
//
export default class ProjectEdit extends React.Component<IProps, IState> {
  static async getInitialProps(ctx) {
    console.log("id=", ctx.query.id)
    const id = ctx.query.id
    const data = await client.query({
      query: gql`
      query {
        project(id: ${id}) {
          id
          name
          createdAt
        }                             
      }
      ` ,
      fetchPolicy: "network-only"
    });
//console.log(data.data.project); 
    const item = data.data.project;
    return {
      id: id,
      item: item,
      csrf: '',
    };
  }
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.state = {
      name: this.props.item.name, 
      _token : this.props.csrf.token,
      userId: '', button_display: false,
    }
console.log(this.props )
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log( "user_id=" , uid)    
    if(uid === null){
      flash.set({ messages_error: 'Error, Login require' })
      Router.push('/auth/login');
    }else{
      this.setState({
        userId: uid, button_display: true,
      });      
    }
  }  
  async handleClickDelete(){
    console.log("#deete-id:" , this.props.id)
    try {
      const result = await client.mutate({
        mutation:  gql`
        mutation {
          deleteProject(id: ${this.props.id}){
            id
          }          
        }
      ` 
      })
console.log(result);
/*
      if(result.data.deleteBook.id === 'undefined'){
        throw new Error('Error , deleteTask');
      }
*/
      Router.push('/projects');      
    } catch (error) {
      console.error(error);
    }     
  } 
  async handleClick(){
  console.log("#-handleClick")
    await this.update_item()
  }     
  async update_item(){
    try {
      console.log("#update_item-id:" , this.props.id);
      const name = document.querySelector<HTMLInputElement>('#name');
                 
      const result = await client.mutate({
        mutation: gql`
        mutation {
          updateProject(id: ${this.props.id}, name: "${name.value}"){
            id
          }                    
        }                    
      `
      });
console.log(result);
/*
      if(result.data.updateBook.id === 'undefined'){
        throw new Error('Error , updateBook');
      }
*/
      Router.push('/projects');
    } catch (error) {
      console.error(error);
      alert("Error, save item");
    }     
  }
  render() {
console.log(this.state);
//console.log(content);
    return (
      <Layout>
        {this.state.button_display ? (<div />): (
          <LoadingBox></LoadingBox>
        )
        }        
        <div className="container">
          <Link href="/projects">
            <a className="btn btn-outline-primary mt-2">Back</a></Link>
          <hr className="my-1" />
          <h3>Project - Edit</h3>
          ID : {this.props.id}
          <hr className="my-1" />
          <div className="col-md-6 form-group">
            <label>Name:</label>
            <input type="text" id="name" className="form-control"
            defaultValue={this.state.name}
             />
          </div>
          {this.state.button_display ? (
            <div>
              <div className="form-group mt-2">
                <button className="btn btn-primary" onClick={this.handleClick}>Save
                </button>
              </div>
              <hr className="my-2" /> 
              <div className="form-group">
                <button className="btn btn-danger" onClick={this.handleClickDelete}>Delete
                </button>
              </div>
            </div>
            ): ""
          }          
          <hr className="my-2" />
        </div>
      </Layout>
    );
  }
}

