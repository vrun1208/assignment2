import axios from 'axios';
import { useEffect, useState } from 'react';
import "../App.css"

const Dashboard = () =>{
    const [list, setList] = useState([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [selectedRows, setSelectedRows] = useState([])
    const [edit, setEdit] = useState(null)

    //pagination
    const totalPages = Math.ceil(list.length /10);
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const pageData = list.slice(startIndex, endIndex);

    useEffect(() => {
        get_data();
    },[])


    const get_data = async() =>{
        const {data} = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json') 
        setList(data); 
        //console.log(list.id);
    }

    const handleSearch =() => {
      return list.filter(
        (user) => user.name.toLowerCase().includes(search) ||
        user.id.toLowerCase().includes(search)
      );
    }

    //pagination logic
    const renderPagination = () => (
        <div className='pagination'>
            <span onClick={() => page>1 ? setPage(page-1) : setPage(1)}>⬅️</span>
                {[...Array(totalPages)].map((_, i) => {
                    return <span key={i} className={page === i + 1 ? "pagination__selected" : ""} onClick={() => setPage(i+1)}>{i+1}</span>
                })}
            <span onClick={() => page<totalPages ? setPage(page+1) : setPage(page)}>➡️</span>  
        </div>
      );

    //delete row where user_id equals to selected user_id
    const handleDeleteRow = (id) => {
      setList((prevUserData) =>
        prevUserData.filter(user => user.id !== id)
      );    
    };  

    //function to store selected rows by their ID's
    const handleSelectRow = (id) => {
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows.includes(id)) {
          return prevSelectedRows.filter(rowId => rowId !== id);
        } else {
          return [...prevSelectedRows, id];
        }
      });
    };  

    //delete selected rows and make setSelectedRow state empty  
    const handleDeleteSelected = () => {
      setList((prevUserData) =>
        prevUserData.filter(user => !selectedRows.includes(user.id))
      );
      setSelectedRows([]);
    };  

    //function to select all the rows of current page
    const handleSelectAll = (check) =>{
        if(check){
            setSelectedRows(pageData.map(user => user.id))
        }
        else{
            setSelectedRows([])
        }
    }  

    //set id which is selected for edit
    const handleEdit = (id) => {
        setEdit(id)
    }

    //function to update user_name and return the updated data
    const handleEditChange = (e, id) => {
        const updatedData = list.map(user => {
          if (user.id === id) {
            return { ...user, name: e.target.value };
          }
          return user;
        });
        setList(updatedData);
      };

    //function to save the edited data  
    const handleSaveEdit = () => {
        setEdit(null)
    }  

  return (
    <div className='table'>
      <div className='search_input'>
        <input type="text" id="search" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <table>

        <thead>
          <tr>
            <th><input type="checkbox" checked={selectedRows.length === pageData.length} onChange={(e) => handleSelectAll(e.target.checked)} /></th>
            {/*<th>User ID</th>*/}
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
    
        <tbody className='tbody'>
          {handleSearch().slice((page - 1) * 10, (page - 1) * 10 + 10).map(user => (
            <tr key={user.id} className={selectedRows.includes(user.id) ? 'row' : ''}>
              <td><input type="checkbox" checked={selectedRows.includes(user.id)} onChange={() => handleSelectRow(user.id)} /></td>
              {/*<td>{user.id}</td>*/}
              <td>{edit === user.id ? <input type="text" value={user.name} onChange={(e) => handleEditChange(e, user.id)} /> : user.name}</td>
              <td>{user.email}</td>
              <td>
                {edit === user.id ? (
                  <button className='save_btn' onClick={() => handleSaveEdit(user.id)}>Save</button>
                ) : (
                  <>
                    <button className='edit_btn' onClick={() => handleEdit(user.id)}>Edit</button>
                    <button className='delete_btn' onClick={() => handleDeleteRow(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {renderPagination()}
      </div>
      <div className='bottom_div'>
        <span>{selectedRows.length} items Selected</span>
        <button className={selectedRows.length === 0 ? 'dlt_select_btn_not' : 'dlt_select_btn'} onClick={handleDeleteSelected}>Delete Selected</button>
      </div>
    </div>
  )
}


export default Dashboard