
import React, {useState, useEffect} from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {  convertToRaw, ContentState, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// convertFromHTML
import htmlToDraft from 'html-to-draftjs';

export default function NewsEditor(props) {
    const [editorState, seteditorState] = useState('')
    useEffect(() => {
      // 为了以防切换到一个没有传递content组件的初始化时候，htmlToDraft(props.content) 会报错，这里做一下空值校验。
      if(props.content === undefined) {
        return
      }
      const contentBlock = htmlToDraft(props.content)
      if(contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        seteditorState(editorState)
      }
    }, [props.content])
    
  return (
    <div>
        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            // 每次状态更新的时候触发，会频繁触发。需要设置在失去焦点的时候传递数据。
            onEditorStateChange={(editorState) => seteditorState(editorState)}

            onBlur={() => {
               
               props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        
            }}
        />
    </div>
  )
}
