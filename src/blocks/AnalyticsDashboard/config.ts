import { Block } from 'payload'

export const AnalyticsDashboardBlock: Block = {
  slug: 'analyticsDashboard',
  labels: {
    singular: 'Analytics Dashboard',
    plural: 'Analytics Dashboards',
  },
  interfaceName: 'AnalyticsDashboardBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Dashboard Title',
      defaultValue: 'Sales Analytics',
    },
    {
      name: 'dateRange',
      type: 'select',
      label: 'Default Date Range',
      defaultValue: 'last_30_days',
      dbName: 'date_range',
      options: [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 Days', value: 'last_7_days' },
        { label: 'Last 30 Days', value: 'last_30_days' },
        { label: 'Last 90 Days', value: 'last_90_days' },
        { label: 'This Month', value: 'this_month' },
        { label: 'Last Month', value: 'last_month' },
        { label: 'This Year', value: 'this_year' },
        { label: 'Custom Range', value: 'custom' },
      ],
    },
    {
      name: 'widgets',
      type: 'array',
      label: 'Dashboard Widgets',
      admin: {
        description: 'Configure which analytics widgets to display',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          dbName: 'widget_type',
          options: [
            { label: 'Sales Overview', value: 'sales_overview' },
            { label: 'Revenue Chart', value: 'revenue_chart' },
            { label: 'Order Statistics', value: 'order_stats' },
            { label: 'Top Products', value: 'top_products' },
            { label: 'Customer Analytics', value: 'customer_analytics' },
            { label: 'Inventory Alerts', value: 'inventory_alerts' },
            { label: 'Payment Methods', value: 'payment_methods' },
            { label: 'Geographic Sales', value: 'geographic_sales' },
            { label: 'Conversion Funnel', value: 'conversion_funnel' },
            { label: 'Recent Orders', value: 'recent_orders' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Custom title for this widget (optional)',
          },
        },
        {
          name: 'size',
          type: 'select',
          label: 'Widget Size',
          defaultValue: 'medium',
          dbName: 'widget_size',
          options: [
            { label: 'Small (1/4 width)', value: 'small' },
            { label: 'Medium (1/2 width)', value: 'medium' },
            { label: 'Large (3/4 width)', value: 'large' },
            { label: 'Full Width', value: 'full' },
          ],
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'refreshInterval',
          type: 'select',
          label: 'Auto Refresh',
          defaultValue: 'none',
          dbName: 'refresh_int',
          options: [
            { label: 'No Auto Refresh', value: 'none' },
            { label: 'Every Minute', value: '1m' },
            { label: 'Every 5 Minutes', value: '5m' },
            { label: 'Every 15 Minutes', value: '15m' },
            { label: 'Every Hour', value: '1h' },
          ],
        },
      ],
    },
    {
      name: 'permissions',
      type: 'group',
      label: 'Access Permissions',
      fields: [
        {
          name: 'allowedRoles',
          type: 'select',
          hasMany: true,
          dbName: 'roles',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Manager', value: 'manager' },
            { label: 'Staff', value: 'staff' },
          ],
          admin: {
            description: 'Which user roles can view this dashboard',
          },
        },
        {
          name: 'hideFinancials',
          type: 'checkbox',
          label: 'Hide Financial Data for Non-Admins',
          defaultValue: true,
          admin: {
            description: 'Hide revenue and profit data from non-admin users',
          },
        },
      ],
    },
    {
      name: 'exportOptions',
      type: 'group',
      label: 'Export Options',
      fields: [
        {
          name: 'enablePdfExport',
          type: 'checkbox',
          label: 'Enable PDF Export',
          defaultValue: true,
        },
        {
          name: 'enableCsvExport',
          type: 'checkbox',
          label: 'Enable CSV Export',
          defaultValue: true,
        },
        {
          name: 'enableScheduledReports',
          type: 'checkbox',
          label: 'Enable Scheduled Reports',
          defaultValue: false,
          admin: {
            description: 'Allow users to schedule automatic report generation',
          },
        },
      ],
    },
  ],
}
