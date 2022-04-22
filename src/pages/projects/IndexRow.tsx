import Link from 'next/link';
//import Header from '../Layout/AppHead';

const IndexRow = props => (
  <div className="row justify-content-center">
    <div className="task_card_box card shadow-lg mb-2">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row">
          <div className="card_col_icon px-md-2 py-2 ">
            <i className="bi bi-clipboard"></i>
          </div>
          <div className="card_col_body  p-md-2">
            <h3>
              <Link href={`/tasks?project=${props.id}`}><a>{props.name}</a>
              </Link>
            {/*
            */}
            </h3>
            {props.date} , ID : {props.id} 
            <Link href={`/projects/edit/${props.id}`}>
              <a className="btn btn-sm btn-outline-primary mx-2 mt-2"> Edit</a>
            </Link><br />                    
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default IndexRow;
