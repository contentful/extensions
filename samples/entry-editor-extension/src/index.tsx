import * as React from "react"
import { render } from "react-dom"
import {
  TextInput,
  Textarea,
  Card,
  DisplayText,
  Paragraph,
  SectionHeading,
  FieldGroup,
  RadioButtonField
} from "@contentful/forma-36-react-components"
import { init, SidebarExtensionSDK } from "contentful-ui-extensions-sdk"
// import tokens from "@contentful/forma-36-tokens"
import "@contentful/forma-36-react-components/dist/styles.css"
import "./index.css"
// import { id as extensionId } from "../extension.json"

interface AppProps {
  sdk: SidebarExtensionSDK
}

interface AppState {
  title?: string
  body?: string
  hasAbstract: boolean
  abstract?: string
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.state = {
      title: props.sdk.entry.fields.title.getValue(),
      body: props.sdk.entry.fields.body.getValue(),
      abstract: props.sdk.entry.fields.abstract.getValue(),
      hasAbstract: props.sdk.entry.fields.hasAbstract.getValue()
    }
  }

  componentDidMount() {
    //this.props.sdk.window.startAutoResizer()
    this.toggleField(this.state.hasAbstract)
  }

  // onButtonClick = async () => {
  //   const result = await this.props.sdk.dialogs.openExtension({
  //     id: extensionId,
  //     width: 800,
  //     title: "The same extension rendered in modal window"
  //   })
  //   console.log(result)
  // }

  onTitleChangeHandler = event => {
    this.props.sdk.entry.fields.title.setValue(event.target.value)
  }
  onBodyChangeHandler = event => {
    this.props.sdk.entry.fields.body.setValue(event.target.value)
  }
  onAbstractChangeHandler = event => {
    this.props.sdk.entry.fields.abstract.setValue(event.target.value)
  }
  onHasAbstractChangeHandler = event => {
    let hasAbstract = event.target.value === "yes"

    this.setState({ hasAbstract })
    this.props.sdk.entry.fields.hasAbstract.setValue(hasAbstract)

    this.toggleField(hasAbstract)
  }
  toggleField = (hasAbstract: boolean) => {
    let show = hasAbstract ? "block" : "none"
    document.querySelector(".abstractContainer").style.display = show
  }
  render() {
    return (
      <div>
        <Card className="fields">
          <DisplayText>Entry extension demo</DisplayText>
          <Paragraph>
            This demo uses a single UI Extension to render all UI for an entry.
          </Paragraph>
          <SectionHeading>Title</SectionHeading>
          <TextInput
            // suppressContentEditableWarning={true}
            // className="title"
            //contentEditable
            onChange={this.onTitleChangeHandler}
            value={this.state.title}
          />
          <SectionHeading>Body</SectionHeading>
          <Textarea
            // suppressContentEditableWarning={true}
            // className="body"
            // contentEditable
            onChange={this.onBodyChangeHandler}
            value={this.state.body}
          />
          <SectionHeading>Has abstract?</SectionHeading>
          <FieldGroup row={false}>
            <RadioButtonField
              labelText="Yes"
              checked={this.state.hasAbstract}
              value="yes"
              onChange={this.onHasAbstractChangeHandler}
              name="abstractOption"
              id="checkbox1"
            />
            <RadioButtonField
              labelText="No"
              checked={!this.state.hasAbstract}
              value="no"
              onChange={this.onHasAbstractChangeHandler}
              name="abstractOption"
              id="checkbox1"
            />
          </FieldGroup>
          <div className="abstractContainer">
            <SectionHeading>Abstract</SectionHeading>
            <Textarea
              // suppressContentEditableWarning={true}
              // className="body"
              // contentEditable
              onChange={this.onAbstractChangeHandler}
              value={this.state.abstract}
            />
          </div>
        </Card>
        {/* <Button
          buttonType="positive"
          isFullWidth={true}
          onClick={this.keyboardInputHandler}
        >
          Click on me to open dialog extension
        </Button> */}
      </div>
    )
  }
}

init(sdk => {
  render(
    <App sdk={sdk as SidebarExtensionSDK} />,
    document.getElementById("root")
  )
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
