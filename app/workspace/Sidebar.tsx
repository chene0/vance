
"use client";

import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";
import { GetFileFromBucket } from "../lib/actions";
import React from 'react'
import { use } from "react";

import { useAppSelector, useAppDispatch } from '../hooks'
import { setSelectedFile, selectWorkspace, fetchFileByRawURL } from './workspaceSlice'

function RecurseFiles(files: any) {
  const selectedFile = useAppSelector(selectWorkspace)
  const dispatch = useAppDispatch()

  const res: any[] = []
  for (const item in files) {
    if (typeof files[item] === 'string') {
      res.push(
        <Sidebar.Item key={files[item]}>{
          <form action={() => {
            dispatch(fetchFileByRawURL(files[item]))
          }}>
            <button>{item}</button>
          </form>
        }</Sidebar.Item>
      )
    } else {
      res.push(<Sidebar.Collapse label={item} key={item}>
        {RecurseFiles(files[item])}
      </Sidebar.Collapse>)
    }
  }
  return res
}

export default function Component(files: any) {
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