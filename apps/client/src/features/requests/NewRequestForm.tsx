import { objectTypeLabels, type ObjectType } from '@appraisal/api-client';
import { Button, Callout, Field, Input, Select } from '@appraisal/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useCreateRequest } from './queries';
import styles from './NewRequestForm.module.css';

const objectTypes = Object.keys(objectTypeLabels) as [ObjectType, ...ObjectType[]];

export function NewRequestForm() {
  const { t } = useTranslation();
  const create = useCreateRequest();

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, t('form.errEmailRequired')).email(t('form.errEmailFormat')),
        phone_number: z
          .string()
          .min(1, t('form.errPhoneRequired'))
          .regex(/^\+?[0-9\s()-]{7,}$/, t('form.errPhoneFormat')),
        object_type: z.enum(objectTypes),
        address: z.string().max(500).optional(),
      }),
    [t],
  );
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { object_type: 'apartment', email: '', phone_number: '', address: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await create.mutateAsync({ ...values, address: values.address || undefined });
    reset();
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Field label={t('form.email')} htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
      </Field>

      <Field label={t('form.phone')} htmlFor="phone" error={errors.phone_number?.message}>
        <Input id="phone" inputMode="tel" placeholder="+7 900 000-00-00" {...register('phone_number')} />
      </Field>

      <Field label={t('form.objectType')} htmlFor="object_type">
        <Select id="object_type" {...register('object_type')}>
          {objectTypes.map((type) => (
            <option key={type} value={type}>
              {t(`object.${type}`)}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t('form.address')} htmlFor="address" hint={t('form.addressHint')} error={errors.address?.message}>
        <Input id="address" placeholder={t('form.addressPlaceholder')} {...register('address')} />
      </Field>

      {create.isError && <Callout tone="danger">{t('form.fail')}</Callout>}
      {create.isSuccess && <Callout tone="go">{t('form.ok')}</Callout>}

      <Button type="submit" loading={isSubmitting || create.isPending}>
        {t('form.submit')}
      </Button>
    </form>
  );
}
