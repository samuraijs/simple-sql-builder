import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Select from '../select/select.component';
import { fields, operators } from '../../app.config';
import { getCondition, defaultCondition } from '../../shared/libs/utils';
import styles from './form-condition.module.scss';

const DefaultForm = ({
  getSelectOptionsFromFields,
  onFieldChange,
  currentCondition,
  getSelectOptionsFromOperators,
  onOperatorChanged,
  getCurrentConditionOperator,
  onInputUpdate,
}) => (
  <div className={styles['container-form']}>
    <Select
      className={styles['default-form-item']}
      options={getSelectOptionsFromFields()}
      onChange={(selected) => onFieldChange(selected)}
      defaultValue={currentCondition}
    />
    <Select
      className={styles['default-form-item']}
      options={getSelectOptionsFromOperators()}
      onChange={(selected) => onOperatorChanged(selected)}
      defaultValue={getCurrentConditionOperator()}
    />
    <input
      className={classNames(styles['default-form-item'], styles.input)}
      placeholder={currentCondition.defaultValue}
      defaultValue={currentCondition.value}
      onKeyUp={(e) => onInputUpdate(e.target.value)}
    />
  </div>
);

const BetweenForm = ({
  getSelectOptionsFromFields,
  onFieldChange,
  currentCondition,
  getSelectOptionsFromOperators,
  onOperatorChanged,
  getCurrentConditionOperator,
  onMinUpdate,
  onMaxUpdate,
}) => (
  <div className={styles['container-form']}>
    <Select
      className={classNames(styles['between-form-item'], styles.select)}
      options={getSelectOptionsFromFields()}
      onChange={(selected) => onFieldChange(selected)}
      defaultValue={currentCondition}
    />
    <span className={styles.filler}>is</span>
    <Select
      className={classNames(styles['between-form-item'], styles.select)}
      options={getSelectOptionsFromOperators()}
      onChange={(selected) => onOperatorChanged(selected)}
      defaultValue={getCurrentConditionOperator()}
    />
    <input
      className={classNames(styles['between-form-input'], styles.input)}
      onKeyUp={(e) => onMinUpdate(e.target.value)}
      defaultValue={currentCondition.min}
    />
    <span className={styles.filler}>and</span>
    <input
      className={classNames(styles['between-form-input'], styles.input)}
      onKeyUp={(e) => onMaxUpdate(e.target.value)}
      defaultValue={currentCondition.max}
    />
  </div>
);
const fieldIndexes = fields.reduce((acc, curr, i) => {
  acc[curr.key] = i;
  return acc;
}, {});

export default function FormCondition({
  className = '',
  availableFields,
  condition = defaultCondition,
  onConditionUpdate,
  onRemove,
}) {
  const onRemoveClicked = (e) => {
    onRemove(e);
  };
  const onFieldChange = (selected) => {
    const field = fields[fieldIndexes[selected.key]];
    const newCondition = getCondition(field);
    onConditionUpdate(newCondition);
  };

  const onOperatorChanged = (selected) => {
    // TODO: Check in here if type operator is between
    let newCondition = {
      ...condition,
      operator: selected.key,
    };
    if (selected.key === 'between') {
      newCondition = {
        ...newCondition,
        min: '',
        max: '',
      };
    } else {
      newCondition = {
        ...newCondition,
        value: '',
      };
    }
    onConditionUpdate(newCondition);
  };
  const onMinUpdate = (value) => {
    onConditionUpdate({
      ...condition,
      min: value,
    });
  };
  const onMaxUpdate = (value) => {
    onConditionUpdate({
      ...condition,
      max: value,
    });
  };
  const onInputUpdate = (value) => {
    onConditionUpdate({
      ...condition,
      value,
    });
  };
  const getCurrentConditionOperator = () => ({
    label: condition.operator,
    key: condition.operator,
  });
  const getSelectOptionsFromFields = () =>
    availableFields.map(({ label, key }) => ({
      label,
      key,
    }));
  const getSelectOptionsFromOperators = () =>
    operators[condition.type].map((key) => ({
      label: key,
      key,
    }));
  return (
    <div className={classNames(styles.container, className)}>
      <button className={styles.remove} onClick={(e) => onRemoveClicked(e)}>
        <FontAwesomeIcon icon={faTimes} className={styles.icon} />
      </button>
      {condition.operator === 'between' ? (
        <BetweenForm
          currentCondition={condition}
          getSelectOptionsFromFields={getSelectOptionsFromFields}
          onFieldChange={onFieldChange}
          getSelectOptionsFromOperators={getSelectOptionsFromOperators}
          onOperatorChanged={onOperatorChanged}
          getCurrentConditionOperator={getCurrentConditionOperator}
          onMinUpdate={onMinUpdate}
          onMaxUpdate={onMaxUpdate}
        />
      ) : (
        <DefaultForm
          currentCondition={condition}
          getSelectOptionsFromFields={getSelectOptionsFromFields}
          onFieldChange={onFieldChange}
          getSelectOptionsFromOperators={getSelectOptionsFromOperators}
          onOperatorChanged={onOperatorChanged}
          getCurrentConditionOperator={getCurrentConditionOperator}
          onInputUpdate={onInputUpdate}
        />
      )}
    </div>
  );
}
