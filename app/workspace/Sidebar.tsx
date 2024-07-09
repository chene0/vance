
"use client";

import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";

function RecurseFiles(files: any){
  const res : any[] = []
  for(const item in files){
    if(typeof files[item] === 'string'){
      res.push(<Sidebar.Item href="#">{files[item]}</Sidebar.Item>)
    }else{
      res.push(<Sidebar.Collapse label={item}>
        {RecurseFiles(files[item])}
      </Sidebar.Collapse>)
    }
  }
  return res
}

export default function Component( files: any) {
  console.log(files);
  const render = RecurseFiles(files)

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {render}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}