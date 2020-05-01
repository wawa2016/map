import React from 'react'
// import './index.css'

import {
	TextField,

	ListItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'

// import { Localized/*, withLocalization*/ } from '../Localized/'

import { getTranslation } from '../../functions.js'

import categories from '../../data/dist/categories.json'
import _presets_ from '../../data/dist/presets.json'
import colors from '../../data/dist/colors.json'

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: option => option.name_translated+' | '+option.category_name_translated,
});



const preset4options = preset => ({
	...preset,
	name_translated: getTranslation(preset.name),
	icon: preset.icon ? preset.icon.toLowerCase() : '',
})
const presetSorter = (a, b) => {
	const icon_compare = b.icon.localeCompare(a.icon)
	const name_compare = -b.name_translated.localeCompare(a.name_translated)
	return icon_compare === 0 ? name_compare : icon_compare
}

const _options_ = [].concat(
			...(
				categories
				.map(category =>
					Object.values(_presets_)
					.filter(preset => category.presets.some(
						presetKey => preset.key === presetKey || preset.key.startsWith(presetKey+'/')
					))
					.map(preset => preset4options({
						...preset,

						category_name_translated: getTranslation(category.name),
						color: category.color,
					}))
					.sort(presetSorter)
				)
			),
			...(
				Object.values(_presets_)
				.filter(preset => !categories.some(
					category => category.presets.some(
						presetKey => (
							preset.key === presetKey
							|| preset.key.startsWith(presetKey+'/')
						)
					)
				))
				.map(preset => preset4options({
					...preset,
					category_name_translated: 'Weitere',
					color: colors.default,
				}))
				.sort(presetSorter)
			)
		)

export default class PresetInput extends React.Component {
	constructor(props) {
		super(props)

		this.presetChanged = this.presetChanged.bind(this)
	}

	presetChanged(event, value){
		if (this.props.onChange) {
			this.props.onChange(value.key || undefined)
		}
	}

	render() {

		let defaultValue = undefined
		if (this.props.defaultValue && _presets_[this.props.defaultValue]) {
			defaultValue = preset4options({
				..._presets_[this.props.defaultValue],
				category_name_translated: '', // isn't really needed
				color: colors.default, // isn't really needed
			})
		}

		return (<div style={this.props.style}>
			<Autocomplete
				options={_options_}
				groupBy={preset => preset.category_name_translated || ''}
				getOptionLabel={preset => preset.name_translated}
				getOptionSelected={(preset, value) => !!value && value.key === preset.key}
			
				renderOption={(preset) => (<ListItem
					component="div"
						style={{
						margin: '-6px -16px -6px -24px',
					}}
				>
					<ListItemIcon>
						<div
							className="material-icons-round"
							style={{
								color: (preset.icon ? preset.color.fg : ''),
								backgroundColor: (preset.icon ? preset.color.bg : ''),
								borderRadius: '100%',
								width: '40px',
								height: '40px',
								lineHeight: '40px',
								textAlign: 'center',
							}}
						>{preset.icon}</div>
					</ListItemIcon>
					<ListItemText primary={preset.name_translated}/>
				</ListItem>)}
				
				blurOnSelect
				openOnFocus
			
				clearText="nextQuestionIDs"
				closeText="Close"
				noOptionsText="No options"
				openText="Open"
			
				filterOptions={filterOptions}
				defaultValue={defaultValue}
				onChange={this.presetChanged}
			
				renderInput={(params) => (<TextField
					{...params}
			
					label={this.props.label || ''}
					variant="outlined"
					color="secondary"
				/>)}
			/>
		</div>)
	}
}