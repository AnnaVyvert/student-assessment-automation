import React from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { accountValidate } from "../../utills/account_validate";
import { getRights } from "../../utills/get_rights";
import './side_menu.css'

const MenuBar = () => {
  const navigate = useNavigate()
  const sideNav = useRef()
  const sideToNav = useRef()
  const menu_point = (value, link) => <span onClick={()=>{navigate(`${link}`); window.location.reload()}}>{value}</span>
  const menu = 
  <>
    <div ref={sideNav} className="sidenav" onClick={()=>{}}>
      <div style={{ height: '3em'}} />
      {/* {menu_point('Личный кабинет', '/personal')} */}
      {/* {menu_point('Авторизация', '/sign')} */}
      {menu_point('Список групп', '/group-list')}
      {menu_point('Список студентов', '/student-list')}
      {menu_point('Список предметов', '/subject-list')}
      {menu_point('Промежуточная ведомость', '/edit-mark-form')}
      {menu_point('Итоговая ведомость', '/final-form')}
    </div>
    <div ref={sideToNav} className="side-to-nav" onClick={()=>{openMenu(false)}} />
  </>

  function openMenu(bool) {
    if(bool){
      sideNav.current.style.width = "480px"
      sideToNav.current.style.width = "100%"
    }else{
      sideNav.current.style.width = "0"
      sideToNav.current.style.width = "0"
    }
    // document.getElementById("mySidenav").style.width = "230px";
  }
    
  return(
    <>
        {menu}
        <span className="menu-btn" onClick={()=>{openMenu(true)}}>&#9776;</span>
    </>
  )
}

export default MenuBar