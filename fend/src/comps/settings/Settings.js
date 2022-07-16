import React from "react";
import Fragment from "../common/Fragment";
import Nav from "../nav/Nav";

function Settings() {
  return (
    <Fragment>
      <Nav />
      <div className="flex flex-row h-[100%] divide-x">
        <div>
          <ul class="menu bg-base-100 w-56 p-2 rounded-box">
            <li class="menu-title">
              <span>Category</span>
            </li>
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
            <li class="menu-title">
              <span>Category</span>
            </li>
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
        <div className="flex w-[100%] justify-center">
          <ul class="menu bg-base-100 w-56 p-2 rounded-box">
            <li class="menu-title">
              <span>Category</span>
            </li>
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
            <li class="menu-title">
              <span>Category</span>
            </li>
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default Settings;
