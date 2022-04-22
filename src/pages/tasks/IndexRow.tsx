import Link from 'next/link';
//import Header from '../Layout/AppHead';

const IndexRow = function(props){
console.log(props);
  let bg_status_color = "";
  if(props.status === 'working'){
    bg_status_color = "task_card_bg_blue";
  }else if(props.status === 'complete'){
    bg_status_color = "task_card_bg_gray";
  }
//working
//bg-primary
// "task_card_box card shadow-lg mb-0 card_bg_blue"
  return(
    <div className="row justify-content-center p-1 task_index_row">
      <div className={`task_card_box card shadow-lg mb-0 ${bg_status_color}`}>
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row">
            <div className="card_col_icon px-md-2 py-2 ">
              <i className="bi bi-clipboard"></i>
            </div>
            <div className="card_col_body  p-md-2">
              {/*<h3 className="task_title"> */}
              <Link href={`/tasks/${props.id}`}><a>
                <span className="task_title fs-5">{props.title}
                </span>
                </a>
              </Link><br />
              <span className="task_date_area text-secondary">{props.date} , ID : {props.id} 
              </span>
              <Link href={`/tasks/edit/${props.id}`}>
                <a className="btn btn-sm btn-outline-primary mx-2 mt-1"> Edit</a>
              </Link><br />                    
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default IndexRow;
