
"use client";

import { Sidebar, Modal, Button } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";
import { GetFileFromBucket } from "../lib/actions";
import * as ContextMenu from '@radix-ui/react-context-menu';
import React, { useState } from 'react'
import { use } from "react";

import { useAppSelector, useAppDispatch } from '../hooks'
import { setSelectedFile, selectWorkspace, fetchFileByRawURL } from './workspaceSlice'
import { getModalSetState, setModalSetState } from "./modalSetSlice";
import { setModalFolderState } from "./modalFolderSlice";
import { setModalFolderDeletionState } from "./modalFolderDeletionSlice";

function RecurseFiles(files: any) {
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
      res.push(
        <ContextMenu.Root>
          <ContextMenu.Trigger className="ContextMenuTrigger">
            <Sidebar.Collapse label={item} key={item}>
              {RecurseFiles(files[item])}
            </Sidebar.Collapse>
          </ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content className="ContextMenuContent">
              <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h1 className="text-black">{item}</h1>
                <ContextMenu.Item className="ContextMenuItem text-black my-1">
                  <Button onClick={() => {
                    dispatch(setModalFolderDeletionState(item))
                  }}>
                    Delete this folder
                  </Button>
                </ContextMenu.Item>
                <ContextMenu.Item className="ContextMenuItem text-black my-1">
                  <Button onClick={() => {
                    dispatch(setModalFolderState(item))
                  }}>
                    Add Subfolder
                  </Button>
                </ContextMenu.Item>
                <ContextMenu.Item className="ContextMenuItem text-black my-1">
                  <Button onClick={() => dispatch(setModalSetState(item))}>
                    Create new set
                  </Button>
                </ContextMenu.Item>
              </a>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      )
    }
  }
  return res
}

export default function Component(files: any) {
  const render = RecurseFiles(files.files)

  return (
    <div>
      <Sidebar aria-label="Sidebar with multi-level dropdown example">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {render}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}