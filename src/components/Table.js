import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Table.scss';

export default function Table() {
  const [universityList, setUniversityList] = useState(JSON.parse(localStorage.getItem('universityList')) || []);
  const [namesOfCheckedList, setNamesOfCheckedList] = useState( JSON.parse(localStorage.getItem('checkedNamesList')) || []);

  useEffect (
      ()=>{
        localStorage.setItem('universityList',JSON.stringify(universityList));
        localStorage.setItem('checkedNamesList',JSON.stringify(namesOfCheckedList));
      },[universityList,namesOfCheckedList]
  )

  const fetchUniversities = (e) => {
    e.preventDefault();
    const endpoint = `http://universities.hipolabs.com/search?country=${e.target[0].value}`;
    axios
      .get(endpoint)
      .then((res) => {
        console.table(res.data);
        setUniversityList(res.data);
        setNamesOfCheckedList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

    return (
    <div>
        <div className="head">
        <h1>Мой список: {namesOfCheckedList.length}</h1>
      <form onSubmit={fetchUniversities}>
        <input type='text' />
        <button type='submit'>Отправить</button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setUniversityList([]);
          }}
        >
          Сбросить
        </button>
      </form>
      </div>
      {universityList.length > 0 && (
        <table className="table">
          <thead className="table-head">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Pages</th>
              <th>Domains</th>
              <th>Code</th>
              <th>Country</th>
              <th>State/Province</th>
              <th>Сохранить в список</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {universityList.map((university,index) => (
              <tr key={university.name}>
                  <td>{index}</td>
                <td>{university.name}</td>
                <td>
                  {university.web_pages.map((page) => (
                    <a key={page} href={page} target='_blank' rel='noreferrer'>
                      {page}
                    </a>
                  ))}
                </td>
                <td>{university.domains.map((domain)=>(
                    <p key={domain}>{domain}</p>
                ))}</td>
                <td>{university.alpha_two_code}</td>
                <td>{university.country}</td>
                <td>{university['state-province']}</td>
                <td><input type="checkbox" checked={namesOfCheckedList.includes(university.name) ? true : false} onChange={(e) => {
                    const positionInNamesList = namesOfCheckedList.indexOf(university.name)
                    if (positionInNamesList === -1) {
                        setNamesOfCheckedList(prev=>[...prev,university.name])
                    }
                    else {
                        setNamesOfCheckedList(prev=>prev.filter((name)=> name !== university.name))
                    }
                    
                }}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
