'use client'
import { ControllerRenderProps, FieldValues, useFormContext, useFieldArray } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Edit, X, Plus, CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { registerPlugin } from 'filepond'
import { FilePond } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import Link from 'next/link'
import { requirements } from './FormSchema'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

interface FormFieldProps {
  name: string
  label: string
  type?:
    | 'text'
    | 'email'
    | 'textarea'
    | 'number'
    | 'select'
    | 'switch'
    | 'password'
    | 'file'
    | 'multi-input'
  placeholder?: string
  options?: { value: string; label: string }[]
  accept?: string
  className?: string
  labelClassName?: string
  inputClassName?: string
  value?: string
  disabled?: boolean
  multiple?: boolean
  isIcon?: boolean
  initialValue?: string | number | boolean | string[]
  forgotPasswordLink?: boolean
  showPasswordStrength?: boolean
}

interface PasswordFieldProps {
  field: ControllerRenderProps<FieldValues, string>
  placeholder?: string
  inputClassName?: string
  disabled?: boolean
  showPasswordStrength?: boolean
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  field,
  placeholder,
  inputClassName,
  disabled = false,
  showPasswordStrength = true,
}) => {
  const id = useId()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  const checkStrength = (pass: string) => {
   
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }

  const strength = checkStrength(field.value || '')

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length
  }, [strength])

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border'
    if (score <= 1) return 'bg-red-500'
    if (score <= 2) return 'bg-orange-500'
    if (score === 3) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Enter a STRONG password'
    if (score <= 2) return 'Weak password'
    if (score === 3) return 'Medium password'
    return 'Strong password'
  }

  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <div className="relative">
        <Input
          id={id}
          className={`pe-9 p-4 ${inputClassName}`}
          placeholder={placeholder}
          type={isVisible ? 'text' : 'password'}
          value={field.value || ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
          ref={field.ref}
          disabled={disabled}
          aria-describedby={`${id}-description`}
        />
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>

      {showPasswordStrength && (
        <>
          <div
            className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label="Password strength"
          >
            <div
              className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
              style={{ width: `${(strengthScore / 4) * 100}%` }}
            ></div>
          </div>

          <p id={`${id}-description`} className="text-foreground mb-2 text-sm font-medium">
            {getStrengthText(strengthScore)}. Must contain:
          </p>

          <ul className="space-y-1.5" aria-label="Password requirements">
            {strength.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                {req.met ? (
                  <CheckIcon size={16} className="text-emerald-500" aria-hidden="true" />
                ) : (
                  <XIcon size={16} className="text-muted-foreground/80" aria-hidden="true" />
                )}
                <span
                  className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
                >
                  {req.text}
                  <span className="sr-only">
                    {req.met ? ' - Requirement met' : ' - Requirement not met'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export const CustomFormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  options,
  className,
  inputClassName,
  labelClassName,
  disabled = false,
  isIcon = false,
  initialValue,
  forgotPasswordLink = false,
  showPasswordStrength = true,
}) => {
  const { control } = useFormContext()

  const renderFormControl = (field: ControllerRenderProps<FieldValues, string>) => {
    // Ensure field value uses initial value if field value is undefined/empty
    const fieldValue = field.value !== undefined && field.value !== '' ? field.value : initialValue
    
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            value={fieldValue as string}
            rows={3}
            className={`p-4 ${inputClassName}`}
          />
        )
      case 'select':
        return (
          <Select
            value={fieldValue as string}
            onValueChange={field.onChange}
          >
            <SelectTrigger className={`w-full  p-4 ${inputClassName}`}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="w-full shadow">
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={`cursor-pointer hover:!bg-gray-100 hover:!text-customgreys-darkGrey`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={fieldValue as boolean}
              onCheckedChange={field.onChange}
              id={name}
              className={`text-customgreys-dirtyGrey ${inputClassName}`}
            />
            <FormLabel htmlFor={name} className={labelClassName}>
              {label}
            </FormLabel>
          </div>
        )
      case 'file':
        return (
          <FilePond
            className={`${inputClassName}`}
            files={fieldValue as File[]}
            onupdatefiles={(fileItems) => {
              const files = fileItems.map((fileItem) => fileItem.file)
              field.onChange(files)
            }}
            allowMultiple={true}
            labelIdle={`Drag & Drop your images or <span class="filepond--label-action">Browse</span>`}
            credits={false}
          />
        )
      case 'number':
        return (
          <Input
            type="number"
            placeholder={placeholder}
            {...field}
            value={fieldValue as string}
            className={`p-4 ${inputClassName}`}
            disabled={disabled}
          />
        )
      case 'multi-input':
        return (
          <MultiInputField
            name={name}
            control={control}
            placeholder={placeholder}
            inputClassName={inputClassName}
          />
        )
      case 'password':
        return (
          <PasswordField
            field={{
              ...field,
              value: fieldValue as string
            }}
            placeholder={placeholder}
            inputClassName={inputClassName}
            disabled={disabled}
            showPasswordStrength={showPasswordStrength}
          />
        )
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            value={fieldValue as string}
            className={`p-4 ${inputClassName}`}
            disabled={disabled}
          />
        )
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => (
        <FormItem className={`${type !== 'switch' && 'rounded-md'} relative ${className}`}>
          {type !== 'switch' && (
            <div className="flex justify-between items-center">
              <FormLabel className={`text-sm ${labelClassName}`}>{label}</FormLabel>
              {type === 'password' && forgotPasswordLink && (
                <Link
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              )}

              {!disabled && isIcon && type !== 'file' && type !== 'multi-input' && (
                <Edit className="size-4 text-customgreys-dirtyGrey" />
              )}
            </div>
          )}
          <FormControl>
            {renderFormControl(field)}
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  )
}
interface MultiInputFieldProps {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  placeholder?: string
  inputClassName?: string
}

const MultiInputField: React.FC<MultiInputFieldProps> = ({
  name,
  control,
  placeholder,
  inputClassName,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  className={`flex-1 border-none bg-customgreys-darkGrey p-4 ${inputClassName}`}
                />
              </FormControl>
            )}
          />
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="ghost"
            size="icon"
            className="text-customgreys-dirtyGrey"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append('')}
        variant="outline"
        size="sm"
        className="mt-2 text-customgreys-dirtyGrey"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  )
}
