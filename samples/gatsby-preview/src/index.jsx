class App extends React.Component {
  constructor(props) {
    super(props)

    const parameters = this.props.sdk.parameters
    const projectId = parameters.installation.projectId

    const { contentTypeSlug, isAutoUpdate } = parameters.instance

    this.state = {
      projectId,
      projectUrl:
        'https://' + projectId + '-preview.gtsb.io/' + contentTypeSlug + '/',
      isAutoUpdate: isAutoUpdate,
      webhookUrl:
        'https://backends.ctffns.net/gatsby-preview-proxy/' + projectId
    }
  }

  componentDidMount = () => {
    this.detachFn = this.props.sdk.entry.onSysChanged(this.onSysChanged)

    this.props.sdk.window.startAutoResizer()
  }

  componentWillUnmount = () => {
    this.detachFn()
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval)
    }
  }

  onError = error => {
    this.setState({ working: false })
    this.props.sdk.notifier.error(error.message)
  }

  onSysChanged = () => {
    if (!this.state.isAutoUpdate) {
      return
    }
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval)
    }
    this.debounceInterval = setInterval(this.refreshGatsbyPreview, 1000)
  }

  refreshGatsbyPreview = () => {
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval)
    }

    fetch(this.state.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }).then(
      success => this.props.sdk.notifier.success('Gatsby Preview Updated!'),
      error => this.props.sdk.notifier.error(error)
    )
  }

  openPreviewTab = () => {
    window.open(
      this.state.projectUrl + this.props.sdk.entry.fields.slug.getValue()
    )
  }
  onChange = e => {
    this.setState({ isAutoUpdate: e.target.value === 'yes' }, () => {
      console.log(this.state.isAutoUpdate)
    })
    //e.target.checked = true
  }

  render = () => {
    return (
      <div className="extension">
        <div className="flexcontainer">
          <Forma36.Button buttonType="positive" onClick={this.openPreviewTab}>
            Open preview
          </Forma36.Button>

          <Forma36.FieldGroup row={true}>
            <Forma36.RadioButtonField
              labelText="Auto-update"
              disabled={false}
              checked={this.state.isAutoUpdate}
              value="yes"
              onChange={this.onChange}
              labelIsLight
              name="autoUpdate"
            />
            <Forma36.RadioButtonField
              labelText="Manual update"
              disabled={false}
              checked={!this.state.isAutoUpdate}
              name="someOption"
              value="no"
              onChange={this.onChange}
              labelIsLight
              name="autoUpdate"
            />
          </Forma36.FieldGroup>

          <Forma36.Button
            size="small"
            buttonType="muted"
            onClick={this.refreshGatsbyPreview}
          >
            Update Preview
          </Forma36.Button>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <Forma36.Paragraph
              extraClassNames=""
              element="p"
              style={{ marginRight: '5%' }}
            >
              Powered by:
            </Forma36.Paragraph>

            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDYgMjgiPgogIDxwYXRoIGQ9Ik02Mi45IDEyaDIuOHYxMGgtMi44di0xLjNjLTEgMS41LTIuMyAxLjYtMy4xIDEuNi0zLjEgMC01LjEtMi40LTUuMS01LjMgMC0zIDItNS4zIDQuOS01LjMuOCAwIDIuMy4xIDMuMiAxLjZWMTJ6bS01LjIgNWMwIDEuNiAxLjEgMi44IDIuOCAyLjggMS42IDAgMi44LTEuMiAyLjgtMi44IDAtMS42LTEuMS0yLjgtMi44LTIuOC0xLjYgMC0yLjggMS4yLTIuOCAyLjh6bTEzLjUtMi42VjIyaC0yLjh2LTcuNmgtMS4xVjEyaDEuMVY4LjZoMi44VjEyaDEuOXYyLjRoLTEuOXptOC41IDBjLS43LS42LTEuMy0uNy0xLjYtLjctLjcgMC0xLjEuMy0xLjEuOCAwIC4zLjEuNi45LjlsLjcuMmMuOC4zIDIgLjYgMi41IDEuNC4zLjQuNSAxIC41IDEuNyAwIC45LS4zIDEuOC0xLjEgMi41cy0xLjggMS4xLTMgMS4xYy0yLjEgMC0zLjItMS0zLjktMS43bDEuNS0xLjdjLjYuNiAxLjQgMS4yIDIuMiAxLjIuOCAwIDEuNC0uNCAxLjQtMS4xIDAtLjYtLjUtLjktLjktMWwtLjYtLjJjLS43LS4zLTEuNS0uNi0yLjEtMS4yLS41LS41LS44LTEuMS0uOC0xLjkgMC0xIC41LTEuOCAxLTIuMy44LS42IDEuOC0uNyAyLjYtLjcuNyAwIDEuOS4xIDMuMiAxLjFsLTEuNCAxLjZ6bTYuMS0xLjFjMS0xLjQgMi40LTEuNiAzLjItMS42IDIuOSAwIDQuOSAyLjMgNC45IDUuM3MtMiA1LjMtNSA1LjNjLS42IDAtMi4xLS4xLTMuMi0xLjZWMjJIODNWNS4yaDIuOHY4LjF6bS0uMyAzLjdjMCAxLjYgMS4xIDIuOCAyLjggMi44IDEuNiAwIDIuOC0xLjIgMi44LTIuOCAwLTEuNi0xLjEtMi44LTIuOC0yLjgtMS43IDAtMi44IDEuMi0yLjggMi44em0xMyAzLjVMOTMuNyAxMkg5N2wzLjEgNS43IDIuOC01LjdoMy4ybC04IDE1LjNoLTMuMmwzLjYtNi44ek01NCAxMy43aC03djIuOGgzLjdjLS42IDEuOS0yIDMuMi00LjYgMy4yLTIuOSAwLTUtMi40LTUtNS4zUzQzLjEgOSA0NiA5YzEuNiAwIDMuMi44IDQuMiAyLjFsMi4zLTEuNUM1MSA3LjUgNDguNiA2LjMgNDYgNi4zYy00LjQgMC04IDMuNi04IDguMXMzLjQgOC4xIDggOC4xIDgtMy42IDgtOC4xYy4xLS4zIDAtLjUgMC0uN3oiLz4KICA8cGF0aCBkPSJNMjUgMTRoLTd2Mmg0LjhjLS43IDMtMi45IDUuNS01LjggNi41TDUuNSAxMWMxLjItMy41IDQuNi02IDguNS02IDMgMCA1LjcgMS41IDcuNCAzLjhsMS41LTEuM0MyMC45IDQuOCAxNy43IDMgMTQgMyA4LjggMyA0LjQgNi43IDMuMyAxMS42bDEzLjIgMTMuMkMyMS4zIDIzLjYgMjUgMTkuMiAyNSAxNHptLTIyIC4xYzAgMi44IDEuMSA1LjUgMy4yIDcuNiAyLjEgMi4xIDQuOSAzLjIgNy42IDMuMkwzIDE0LjF6IiBmaWxsPSIjZmZmIi8+CiAgPHBhdGggZD0iTTE0IDBDNi4zIDAgMCA2LjMgMCAxNHM2LjMgMTQgMTQgMTQgMTQtNi4zIDE0LTE0UzIxLjcgMCAxNCAwek02LjIgMjEuOEM0LjEgMTkuNyAzIDE2LjkgMyAxNC4yTDEzLjkgMjVjLTIuOC0uMS01LjYtMS4xLTcuNy0zLjJ6bTEwLjIgMi45TDMuMyAxMS42QzQuNCA2LjcgOC44IDMgMTQgM2MzLjcgMCA2LjkgMS44IDguOSA0LjVsLTEuNSAxLjNDMTkuNyA2LjUgMTcgNSAxNCA1Yy0zLjkgMC03LjIgMi41LTguNSA2TDE3IDIyLjVjMi45LTEgNS4xLTMuNSA1LjgtNi41SDE4di0yaDdjMCA1LjItMy43IDkuNi04LjYgMTAuN3oiIGZpbGw9IiM2MzkiLz4KPC9zdmc+Cg=="
              class="gatsby-logo"
              alt="Gatsby Logo"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    )
  }
}

contentfulExtension.init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'))
})
