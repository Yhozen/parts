import React from 'react'
import {AsyncCreatable, Creatable} from 'react-select'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'

export default class Select extends React.Component {
  static propTypes = {
    fieldName: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
    passProps: PropTypes.object,
    multi: PropTypes.bool,
    options: PropTypes.array,
    errorMessage: PropTypes.node,
    loadOptions: PropTypes.func,
    isValidNewOption: PropTypes.func,
    filterOption: PropTypes.func,
    label: PropTypes.node,
    description: PropTypes.node
  }

  static defaultProps = {
    isValidNewOption: () => false
  }

  state = {}

  @autobind
  onChange(item) {
    const items = this.props.multi ? item : item ? [item] : []
    if (items.length) {
      const values = items.map(item => item.value)
      const finalValue = this.props.multi ? values : values[0]
      this.props.onChange(finalValue)
    } else {
      this.props.onChange(null)
    }
  }

  @autobind
  async loadOptions(input, callback) {
    const options = await this.props.loadOptions(input)
    callback(null, {options})
  }

  @autobind
  filterOption(...args) {
    if (this.props.filterOption) return this.props.filterOption(...args)
    return true
  }

  getFilterOption() {
    if (!this.props.loadOptions) return {options: this.props.options}
    return {filterOption: this.filterOption, loadOptions: this.loadOptions}
  }

  render() {
    const Comp = this.props.loadOptions ? AsyncCreatable : Creatable
    return (
      <div>
        <div className="label">{this.props.label}</div>
        <Comp
          multi={this.props.multi}
          name={this.props.fieldName}
          value={this.props.value}
          isValidNewOption={this.props.isValidNewOption}
          onChange={this.onChange}
          {...this.getFilterOption()}
          {...this.props.passProps}
        />
        <div className="description">{this.props.description}</div>
        <div className="os-input-error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
